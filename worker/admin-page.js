// Moderation page for the wall, served at /admin behind Cloudflare Access.
export default `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml"><title>Wall moderation | Field guide to the tribes</title>
<style>
:root{ --o:#FF4F00; --c:#121212; --s:#F3F3F3; --t:#D9D9D6; }
*{ box-sizing:border-box; }
body{ margin:0; background:var(--s); color:var(--c); font:15px/1.5 "IBM Plex Sans", Arial, sans-serif; }
header{ background:var(--o); padding:24px 32px; }
header h1{ margin:0; font-size:24px; font-family:"IBM Plex Serif", Georgia, serif; font-weight:600; }
header p{ margin:4px 0 0; }
main{ padding:24px 32px 64px; max-width:1312px; }
.stats{ display:flex; gap:32px; margin-bottom:24px; }
.stats b{ display:block; font-size:32px; line-height:1.1; }
.bar{ display:flex; flex-wrap:wrap; gap:8px 16px; align-items:center; margin-bottom:16px; }
input, select, button{ font:inherit; color:inherit; }
input, select{ border:1px solid var(--c); border-radius:2px; background:var(--s); padding:6px 8px; }
button, .btn{ border:1px solid var(--c); border-radius:2px; background:transparent; padding:4px 12px; cursor:pointer; text-decoration:none; }
button.solid{ background:var(--c); color:var(--s); }
button.warn:hover{ background:var(--o); border-color:var(--o); }
table{ width:100%; border-collapse:collapse; }
th, td{ text-align:left; padding:8px; border-bottom:1px solid var(--t); vertical-align:middle; }
th{ font-size:12px; font-weight:600; border-bottom:1px solid var(--c); }
tr.hid td{ color:rgb(18 18 18 / .5); }
tr.hid td.st{ color:var(--c); font-weight:600; }
td.acts{ white-space:nowrap; display:flex; gap:8px; }
.muted{ color:rgb(18 18 18 / .7); font-size:13px; }
section{ margin-top:48px; }
section h2{ font-size:18px; margin:0 0 8px; }
.terms{ display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; }
.terms span{ border:1px solid var(--c); border-radius:2px; padding:2px 4px 2px 8px; display:inline-flex; gap:8px; align-items:center; }
.terms button{ border:0; padding:0 4px; }
#msg{ min-height:1.5em; }
</style></head><body>
<header><h1>Wall moderation</h1><p id="who">Field guide to the tribes of Silicon Valley</p></header>
<main>
  <div class="stats"><div><b id="n-total">–</b>entries</div><div><b id="n-visible">–</b>visible</div><div><b id="n-hidden">–</b>hidden</div></div>
  <div class="bar">
    <label>Show <select id="status"><option value="all">All</option><option value="visible">Visible</option><option value="hidden">Hidden</option></select></label>
    <input id="q" type="search" placeholder="Search names" aria-label="Search names">
    <a class="btn" href="/admin/export.csv">Download CSV</a>
    <span class="muted">Hidden entries disappear from the public wall immediately. Delete removes them for good.</span>
  </div>
  <p id="msg" role="status"></p>
  <table><thead><tr><th>When</th><th>Name</th><th>Tribe</th><th>Speed · Steering · Destination</th><th>Status</th><th></th></tr></thead><tbody id="rows"></tbody></table>
  <p><button id="more" hidden>Show more</button></p>
  <section>
    <h2>Blocked words</h2>
    <p class="muted">Names containing these letters anywhere are rejected, on top of the built-in filter. Existing entries are not affected; hide them above.</p>
    <div class="terms" id="terms"></div>
    <form id="addterm" class="bar"><input id="term" placeholder="word" aria-label="Word to block" pattern="[A-Za-z]{2,30}" required><button class="solid">Block word</button></form>
  </section>
</main>
<script>
const $ = s => document.querySelector(s);
let offset = 0, names = {};
const el = (tag, props = {}, kids = []) => { const e = document.createElement(tag); Object.assign(e, props); kids.forEach(k => e.append(k)); return e; };
const when = ts => new Date(ts).toLocaleString([], { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
async function api(path, opts) {
  const r = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new Error(j.message || "Request failed (" + r.status + ")");
  return j;
}
async function load(append) {
  if (!append) offset = 0;
  const p = new URLSearchParams({ status: $("#status").value, q: $("#q").value, limit: 200, offset });
  try {
    const j = await api("/admin/api/entries?" + p);
    names = j.tribes; $("#who").textContent = "Signed in as " + j.email;
    $("#n-total").textContent = j.counts.total || 0; $("#n-visible").textContent = j.counts.visible || 0; $("#n-hidden").textContent = j.counts.hidden || 0;
    if (!append) $("#rows").replaceChildren();
    j.entries.forEach(e => $("#rows").append(row(e)));
    offset += j.entries.length; $("#more").hidden = offset >= j.total;
    if (!j.total) $("#rows").append(el("tr", {}, [el("td", { colSpan: 6, textContent: "No entries." })]));
  } catch (e) { $("#msg").textContent = e.message; }
}
function row(e) {
  const tr = el("tr", { className: e.hidden ? "hid" : "" });
  const toggle = el("button", { textContent: e.hidden ? "Unhide" : "Hide", className: "warn" });
  toggle.onclick = async () => { try { await api("/admin/api/entries/" + e.id, { method: "POST", body: JSON.stringify({ hidden: !e.hidden }) }); e.hidden = e.hidden ? 0 : 1; tr.replaceWith(row(e)); load(); } catch (err) { $("#msg").textContent = err.message; } };
  const del = el("button", { textContent: "Delete", className: "warn" });
  del.onclick = async () => { if (!confirm("Delete " + e.name + " for good?")) return; try { await api("/admin/api/entries/" + e.id, { method: "DELETE" }); tr.remove(); load(); } catch (err) { $("#msg").textContent = err.message; } };
  const status = e.hidden ? "Hidden" + (e.moderated_by ? " by " + e.moderated_by : "") : "Visible";
  return el("tr", { className: e.hidden ? "hid" : "" }, [
    el("td", { textContent: when(e.created_at) }), el("td", { textContent: e.name }), el("td", { textContent: names[e.tribe] || e.tribe }),
    el("td", { textContent: e.x + " · " + e.y + " · " + e.d }), el("td", { textContent: status, className: "st" }), el("td", { className: "acts" }, [toggle, del])
  ]);
}
async function terms() {
  try {
    const j = await api("/admin/api/blocklist");
    $("#terms").replaceChildren(...(j.terms.length ? j.terms.map(t => { const x = el("button", { textContent: "×", title: "Unblock " + t.term, ariaLabel: "Unblock " + t.term });
      x.onclick = async () => { await api("/admin/api/blocklist/" + t.term, { method: "DELETE" }); terms(); }; return el("span", {}, [t.term, x]); }) : [el("span", { className: "muted", textContent: "None yet." })]));
  } catch (e) { $("#msg").textContent = e.message; }
}
$("#status").onchange = () => load();
let t; $("#q").oninput = () => { clearTimeout(t); t = setTimeout(load, 250); };
$("#more").onclick = () => load(true);
$("#addterm").onsubmit = async ev => { ev.preventDefault(); try { await api("/admin/api/blocklist", { method: "POST", body: JSON.stringify({ term: $("#term").value }) }); $("#term").value = ""; terms(); } catch (e) { $("#msg").textContent = e.message; } };
load(); terms();
</script></body></html>`;
