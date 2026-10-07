import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import worker from "../index.js";

// A D1-shaped wrapper over an in-memory SQLite database.
function fakeD1() {
  const db = new DatabaseSync(":memory:");
  db.exec(fs.readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    first: async () => db.prepare(sql).get(...args) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    run: async () => db.prepare(sql).run(...args)
  });
  return { prepare: sql => stmt(sql), raw: db };
}
const ORIGIN = "https://tribes.thefai.workers.dev";
let env, limiterOk;
beforeEach(() => {
  limiterOk = true;
  env = {
    DB: fakeD1(),
    ASSETS: { fetch: async req => new Response("asset " + new URL(req.url).pathname) },
    RATE_LIMITER: { limit: async () => ({ success: limiterOk }) },
    ALLOWED_ORIGINS: "https://tribes.thefai.org", ACCESS_TEAM_DOMAIN: "https://team.example", ACCESS_AUD: "aud123",
    ADMIN_EMAIL_DOMAIN: "thefai.org", NOINDEX: "1"
  };
});
const call = (path, init = {}) => worker.fetch(new Request(ORIGIN + path, init), env);
let n = 0;
const post = (body, origin = ORIGIN) => call("/api/wall", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin },
  body: JSON.stringify({ name: "cm", tribe: "doomers", x: 4, y: 84, d: 75, token: `tok-${String(++n).padStart(16, "0")}`, ...body }) });

test("GET returns an empty wall", async () => {
  const r = await call("/api/wall"); const j = await r.json();
  assert.equal(r.status, 200);
  assert.deepEqual(j, { ok: true, count: 0, census: [], recent: [], dots: [] });
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), "*");
});
test("POST adds an entry that GET then shows", async () => {
  const r = await post({}); const j = await r.json();
  assert.equal(r.status, 201); assert.equal(j.entry.name, "CM");
  const w = await (await call("/api/wall")).json();
  assert.equal(w.count, 1); assert.deepEqual(w.census, [{ tribe: "doomers", n: 1 }]); assert.equal(w.recent[0].name, "CM"); assert.deepEqual(w.dots[0], { x: 4, y: 84, d: 75, tribe: "doomers" });
  assert.equal(env.DB.raw.prepare("SELECT token_hash FROM entries").get().token_hash.length, 64);
});
test("the same browser token can post once", async () => {
  const body = { token: "same-token-000000000" };
  assert.equal((await post(body)).status, 201);
  const r = await post(body); assert.equal(r.status, 409); assert.equal((await r.json()).code, "duplicate");
});
test("rejects bad tribes, blocked names and other origins", async () => {
  assert.equal((await post({ tribe: "nope" })).status, 400);
  const b = await post({ name: "A.S.S." }); assert.equal(b.status, 400); assert.equal((await b.json()).code, "blocked");
  assert.equal((await post({}, "https://evil.example")).status, 403);
  assert.equal((await post({}, "https://tribes.thefai.org")).status, 201);
});
test("moderator blocklist applies to new posts", async () => {
  env.DB.raw.prepare("INSERT INTO blocked_terms (term, added_at) VALUES ('zq', 0)").run();
  const r = await post({ name: "ZQX" }); assert.equal(r.status, 400); assert.equal((await r.json()).code, "blocked");
  assert.equal((await post({ name: "Chris" })).status, 400);
});
test("rate limits per IP and across the whole wall", async () => {
  limiterOk = false; assert.equal((await post({})).status, 429);
  limiterOk = true;
  const ins = env.DB.raw.prepare("INSERT INTO entries (name, tribe, x, y, d, token_hash, created_at) VALUES ('A', 'ea', 1, 1, 1, ?, ?)");
  for (let i = 0; i < 30; i++) ins.run("h" + i, Date.now());
  const r = await post({}); assert.equal(r.status, 429); assert.equal((await r.json()).code, "rate_limited");
});
test("hidden entries stay off the public wall", async () => {
  await post({ name: "KP" }); await post({ name: "GN" });
  env.DB.raw.prepare("UPDATE entries SET hidden = 1 WHERE name = 'GN'").run();
  const w = await (await call("/api/wall")).json();
  assert.equal(w.count, 1); assert.deepEqual(w.recent.map(e => e.name), ["KP"]);
});
test("everything else falls through to the site, with headers", async () => {
  const r = await call("/index.html");
  assert.equal(await r.text(), "asset /index.html");
  assert.equal(r.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.equal(r.headers.get("X-Content-Type-Options"), "nosniff");
  env.NOINDEX = "0"; assert.equal((await call("/")).headers.get("X-Robots-Tag"), null);
});

// Access: sign a JWT with a throwaway key and serve its JWKS from a stubbed fetch.
async function accessToken(claims) {
  const kp = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const kid = "k" + Math.random().toString(36).slice(2);
  const jwk = { ...(await crypto.subtle.exportKey("jwk", kp.publicKey)), kid };
  const b64 = o => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
  const head = b64({ alg: "RS256", kid }), body = b64({ iss: "https://team.example", aud: ["aud123"], exp: Math.floor(Date.now() / 1000) + 600, ...claims });
  const sig = Buffer.from(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", kp.privateKey, new TextEncoder().encode(`${head}.${body}`))).toString("base64url");
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [jwk] }));
  return `${head}.${body}.${sig}`;
}
test("admin needs Access to be configured and a valid FAI sign-in", async () => {
  env.ACCESS_AUD = ""; assert.equal((await call("/admin")).status, 503);
  env.ACCESS_AUD = "aud123"; assert.equal((await call("/admin")).status, 403);
  const outsider = await accessToken({ email: "someone@gmail.com" });
  assert.equal((await call("/admin", { headers: { "Cf-Access-Jwt-Assertion": outsider } })).status, 403);
  const wrongAud = await accessToken({ email: "a@thefai.org", aud: ["other"] });
  assert.equal((await call("/admin", { headers: { "Cf-Access-Jwt-Assertion": wrongAud } })).status, 403);
  const forged = (await accessToken({ email: "a@thefai.org" })).replace(/\.[^.]+$/, ".AAAA");
  assert.equal((await call("/admin", { headers: { "Cf-Access-Jwt-Assertion": forged } })).status, 403);
});
test("a moderator can list, hide, export and block words", async () => {
  await post({ name: "bob" });
  const tok = await accessToken({ email: "mod@thefai.org" }), h = { "Cf-Access-Jwt-Assertion": tok };
  const page = await call("/admin", { headers: h }); assert.equal(page.status, 200); assert.match(await page.text(), /Wall moderation/);
  const list = await (await call("/admin/api/entries", { headers: h })).json();
  assert.equal(list.total, 1); assert.equal(list.email, "mod@thefai.org");
  const id = list.entries[0].id;
  const w = { ...h, "Content-Type": "application/json", Origin: ORIGIN, "Sec-Fetch-Site": "same-origin" };
  const forgery = { "Content-Type": "text/plain", Origin: "https://evil.example", "Sec-Fetch-Site": "cross-site" };
  for (const bad of [{ ...w, Origin: forgery.Origin }, { ...w, "Sec-Fetch-Site": forgery["Sec-Fetch-Site"] }, { ...w, "Content-Type": forgery["Content-Type"] }])
    assert.equal((await call(`/admin/api/entries/${id}`, { method: "POST", headers: bad, body: JSON.stringify({ hidden: true }) })).status, 403);
  assert.equal((await (await call("/api/wall")).json()).count, 1);
  assert.equal((await call(`/admin/api/entries/${id}`, { method: "POST", headers: w, body: JSON.stringify({ hidden: true }) })).status, 200);
  assert.equal((await (await call("/api/wall")).json()).count, 0);
  assert.equal(env.DB.raw.prepare("SELECT moderated_by FROM entries").get().moderated_by, "mod@thefai.org");
  const csv = await (await call("/admin/export.csv", { headers: h })).text();
  assert.match(csv, /^id,created_at,name/); assert.match(csv, /BOB,doomers,AI Doomers,4,84,75,yes,mod@thefai.org/);
  assert.equal((await call("/admin/api/blocklist", { method: "POST", headers: w, body: JSON.stringify({ term: "Zq" }) })).status, 200);
  assert.equal((await post({ name: "ZQ" })).status, 400);
  assert.equal((await call(`/admin/api/entries/${id}`, { method: "DELETE", headers: w })).status, 200);
  assert.equal(env.DB.raw.prepare("SELECT COUNT(*) AS n FROM entries").get().n, 0);
});
