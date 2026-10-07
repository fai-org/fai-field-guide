// The field guide Worker: serves the static site, the wall API, and a moderation page behind Cloudflare Access.
import { cleanName, validEntry } from "./filter.js";
import { TRIBE_IDS, TRIBE_NAMES } from "./tribes.js";
import adminPage from "./admin-page.js";

const GLOBAL_LIMIT = 30;       // wall posts per rolling minute, across everyone
const RECENT = 30, DOTS = 2000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let res;
    try {
      if (url.pathname === "/api/wall") res = await wallApi(request, env, url);
      else if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) res = await admin(request, env, url);
      else res = await env.ASSETS.fetch(request);
    } catch (e) {
      console.error(e);
      const o = url.pathname === "/api/wall" ? allowedOrigin(request, env, url) : {};
      res = json({ ok: false, code: "server_error", message: "Something went wrong. Try again in a moment." }, 500,
        o.ok && o.origin ? { "Access-Control-Allow-Origin": o.origin, "Vary": "Origin" } : {});
    }
    return withHeaders(res, env);
  }
};

function withHeaders(res, env) {
  const r = new Response(res.body, res);
  r.headers.set("X-Content-Type-Options", "nosniff");
  r.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (env.NOINDEX === "1") r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers } });

/* ---------- Public wall API ---------- */
function allowedOrigin(request, env, url) {
  const origin = request.headers.get("Origin");
  if (!origin) return { ok: true, origin: null };
  const list = String(env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  return { ok: origin === url.origin || list.includes(origin), origin };
}

async function wallApi(request, env, url) {
  if (request.method === "GET" || request.method === "HEAD") return getWall(env);
  const o = allowedOrigin(request, env, url);
  const cors = o.ok && o.origin ? { "Access-Control-Allow-Origin": o.origin, "Vary": "Origin" } : {};
  if (request.method === "OPTIONS") {
    if (!o.ok) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "GET, POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } });
  }
  if (request.method !== "POST") return json({ ok: false, code: "method" }, 405, { Allow: "GET, POST, OPTIONS" });
  if (!o.ok) return json({ ok: false, code: "origin", message: "Posting isn’t allowed from this site." }, 403);
  return postWall(request, env, cors);
}

async function getWall(env) {
  const [count, census, recent, dots] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS n FROM entries WHERE hidden = 0").first(),
    env.DB.prepare("SELECT tribe, COUNT(*) AS n FROM entries WHERE hidden = 0 GROUP BY tribe ORDER BY n DESC").all(),
    env.DB.prepare("SELECT name, tribe, created_at AS ts FROM entries WHERE hidden = 0 ORDER BY created_at DESC LIMIT ?").bind(RECENT).all(),
    env.DB.prepare("SELECT x, y, d, tribe FROM entries WHERE hidden = 0 ORDER BY created_at DESC LIMIT ?").bind(DOTS).all()
  ]);
  return json({ ok: true, count: count ? count.n : 0, census: census.results, recent: recent.results, dots: dots.results }, 200,
    { "Cache-Control": "public, max-age=15", "Access-Control-Allow-Origin": "*" });
}

async function postWall(request, env, cors) {
  const text = await request.text();
  if (text.length > 2048) return json({ ok: false, code: "too_large", message: "That request is too large." }, 413, cors);
  let body;
  try { body = JSON.parse(text); } catch { return json({ ok: false, code: "bad_json", message: "Send JSON." }, 400, cors); }

  if (env.RATE_LIMITER) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) return json({ ok: false, code: "rate_limited", message: "Too many tries. Wait a minute and try again." }, 429, cors);
  }
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM entries WHERE created_at > ?").bind(Date.now() - 60000).first();
  if (recent && recent.n >= GLOBAL_LIMIT) return json({ ok: false, code: "rate_limited", message: "The wall is busy. Try again in a minute." }, 429, cors);

  const v = validEntry(body, TRIBE_IDS);
  if (!v.ok) return json({ ok: false, code: v.code, message: v.message }, 400, cors);
  const terms = (await env.DB.prepare("SELECT term FROM blocked_terms").all()).results.map(r => r.term);
  const c = cleanName(body.name, terms);
  if (c.err) return json({ ok: false, code: c.code, message: c.err }, 400, cors);

  const hash = await sha256(v.entry.token), now = Date.now();
  const dup = await env.DB.prepare("SELECT id FROM entries WHERE token_hash = ?").bind(hash).first();
  if (dup) return json({ ok: false, code: "duplicate", message: "You’re already on the wall." }, 409, cors);
  const row = await env.DB.prepare("INSERT INTO entries (name, tribe, x, y, d, token_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id")
    .bind(c.name, v.entry.tribe, v.entry.x, v.entry.y, v.entry.d, hash, now).first();
  return json({ ok: true, entry: { id: row.id, name: c.name, tribe: v.entry.tribe, x: v.entry.x, y: v.entry.y, d: v.entry.d, ts: now } }, 201, cors);
}

async function sha256(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- Moderation, behind Cloudflare Access ---------- */
let jwks = null, jwksAt = 0;
async function accessEmail(request, env) {
  const cookie = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  const token = request.headers.get("Cf-Access-Jwt-Assertion") || (cookie && cookie[1]);
  if (!token) return null;
  const [h, p, sig] = token.split(".");
  if (!h || !p || !sig) return null;
  let header, claims;
  try { header = JSON.parse(b64text(h)); claims = JSON.parse(b64text(p)); } catch { return null; }
  if (header.alg !== "RS256") return null;
  // Keys are cached for ten minutes, and refetched early when Access rotates to a key we haven't seen.
  if (!jwks || Date.now() - jwksAt > 600000 || !jwks.some(k => k.kid === header.kid)) {
    const r = await fetch(`${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
    if (!r.ok) return null;
    jwks = (await r.json()).keys; jwksAt = Date.now();
  }
  const jwk = jwks.find(k => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64bytes(sig), new TextEncoder().encode(`${h}.${p}`));
  if (!ok) return null;
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(env.ACCESS_AUD) || claims.iss !== env.ACCESS_TEAM_DOMAIN || !(claims.exp * 1000 > Date.now())) return null;
  const email = String(claims.email || "").toLowerCase();
  return email.endsWith("@" + String(env.ADMIN_EMAIL_DOMAIN).toLowerCase()) ? email : null;
}
const b64norm = s => s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
const b64bytes = s => Uint8Array.from(atob(b64norm(s)), c => c.charCodeAt(0));
const b64text = s => new TextDecoder().decode(b64bytes(s));

async function admin(request, env, url) {
  if (!env.ACCESS_AUD) return new Response("Admin is not configured.", { status: 503 });
  const email = await accessEmail(request, env);
  if (!email) return new Response("Forbidden.", { status: 403 });
  const path = url.pathname, m = request.method;
  /* Changes must come from the admin page itself: same origin, sent as JSON (which a cross-site form can't do). */
  if (m !== "GET" && m !== "HEAD") {
    const origin = request.headers.get("Origin"), site = request.headers.get("Sec-Fetch-Site");
    if ((origin && origin !== url.origin) || (site && site !== "same-origin") || !(request.headers.get("Content-Type") || "").startsWith("application/json"))
      return json({ ok: false, code: "forbidden" }, 403);
  }

  if (path === "/admin" || path === "/admin/") return new Response(adminPage, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });

  if (path === "/admin/api/entries" && m === "GET") {
    const status = url.searchParams.get("status") || "all", q = (url.searchParams.get("q") || "").trim();
    const limit = Math.min(500, Math.max(1, +url.searchParams.get("limit") || 200)), offset = Math.max(0, +url.searchParams.get("offset") || 0);
    const where = [], args = [];
    if (status === "visible") where.push("hidden = 0"); else if (status === "hidden") where.push("hidden = 1");
    if (q) { where.push("name LIKE ?"); args.push(`%${q}%`); }
    const w = where.length ? "WHERE " + where.join(" AND ") : "";
    const [total, rows, counts] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS n FROM entries ${w}`).bind(...args).first(),
      env.DB.prepare(`SELECT id, name, tribe, x, y, d, hidden, created_at, moderated_by, moderated_at FROM entries ${w} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...args, limit, offset).all(),
      env.DB.prepare("SELECT SUM(hidden = 0) AS visible, SUM(hidden = 1) AS hidden, COUNT(*) AS total FROM entries").first()
    ]);
    return json({ ok: true, email, total: total.n, counts, tribes: TRIBE_NAMES, entries: rows.results });
  }
  let r;
  if ((r = path.match(/^\/admin\/api\/entries\/(\d+)$/))) {
    const id = +r[1];
    if (m === "POST") {
      const body = await request.json().catch(() => ({}));
      if (typeof body.hidden !== "boolean") return json({ ok: false, code: "bad_request" }, 400);
      await env.DB.prepare("UPDATE entries SET hidden = ?, moderated_by = ?, moderated_at = ? WHERE id = ?").bind(body.hidden ? 1 : 0, email, Date.now(), id).run();
      return json({ ok: true });
    }
    if (m === "DELETE") { await env.DB.prepare("DELETE FROM entries WHERE id = ?").bind(id).run(); return json({ ok: true }); }
  }
  if (path === "/admin/api/blocklist") {
    if (m === "GET") return json({ ok: true, terms: (await env.DB.prepare("SELECT term, added_by, added_at FROM blocked_terms ORDER BY term").all()).results });
    if (m === "POST") {
      const body = await request.json().catch(() => ({}));
      const term = String(body.term || "").toLowerCase().trim();
      if (!/^[a-z]{2,30}$/.test(term)) return json({ ok: false, code: "bad_term", message: "Use 2–30 letters, a to z." }, 400);
      await env.DB.prepare("INSERT OR IGNORE INTO blocked_terms (term, added_by, added_at) VALUES (?, ?, ?)").bind(term, email, Date.now()).run();
      return json({ ok: true });
    }
  }
  if ((r = path.match(/^\/admin\/api\/blocklist\/([a-z]{2,30})$/)) && m === "DELETE") {
    await env.DB.prepare("DELETE FROM blocked_terms WHERE term = ?").bind(r[1]).run();
    return json({ ok: true });
  }
  if (path === "/admin/export.csv" && m === "GET") {
    const rows = (await env.DB.prepare("SELECT id, created_at, name, tribe, x, y, d, hidden, moderated_by FROM entries ORDER BY created_at DESC").all()).results;
    const cell = v => { let s = v == null ? "" : String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const lines = [["id", "created_at", "name", "tribe", "tribe_name", "speed", "steering", "destination", "hidden", "moderated_by"].join(",")]
      .concat(rows.map(e => [e.id, new Date(e.created_at).toISOString(), e.name, e.tribe, TRIBE_NAMES[e.tribe] || "", e.x, e.y, e.d, e.hidden ? "yes" : "no", e.moderated_by].map(cell).join(",")));
    return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="tribes-wall-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
  }
  return json({ ok: false, code: "not_found" }, 404);
}
