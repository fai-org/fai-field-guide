// Checks the quiz in index.html: data shape, how often random takers land in each tribe,
// and whether every tribe can be reached by some set of answers.
// usage: node tools/check-quiz.mjs [path/to/index.html]
import fs from 'fs';
const html = fs.readFileSync(process.argv[2] || new URL('../index.html', import.meta.url), 'utf8');
const block = html.slice(html.indexOf('/* ========================== CONTENT'), html.indexOf('/* ======================= END OF CONTENT'));
const { TRIBES, QUIZ } = new Function(`${block}; return { TRIBES, QUIZ };`)();

const ids = new Set(TRIBES.map(t => t.id));
const problems = [];
for (const [i, q] of QUIZ.entries()) {
  if (q.type === 'likert') { if (!q.w || !Object.keys(q.w).length) problems.push(`Q${i + 1}: likert without weights`); continue; }
  if (!Array.isArray(q.a) || q.a.length < 2) { problems.push(`Q${i + 1}: needs at least two answers`); continue; }
  for (const [text, m, b] of q.a) {
    for (const k in m) if (!'xyd'.includes(k)) problems.push(`Q${i + 1} “${text}”: unknown axis ${k}`);
    for (const t in b) if (!ids.has(t)) problems.push(`Q${i + 1} “${text}”: unknown tribe ${t}`);
  }
}
for (const t of TRIBES) for (const k of ['x', 'y', 'd']) if (!(t[k] >= 0 && t[k] <= 100)) problems.push(`${t.id}: ${k} out of range`);

// Same scoring as the page.
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, 0.8 * (a.d - b.d));
const lo = { x: 0, y: 0, d: 0 }, hi = { x: 0, y: 0, d: 0 };
for (const q of QUIZ) {
  if (q.type === 'likert') for (const k in q.w) { lo[k] -= 2 * Math.abs(q.w[k]); hi[k] += 2 * Math.abs(q.w[k]); }
  else for (const k of ['x', 'y', 'd']) { const v = q.a.map(a => a[1][k] || 0); lo[k] += Math.min(...v); hi[k] += Math.max(...v); }
}
function winner(ans) {
  const sum = { x: 0, y: 0, d: 0 }, bonus = {};
  QUIZ.forEach((q, i) => {
    const r = ans[i]; if (r == null) return;
    if (q.type === 'likert') for (const k in q.w) sum[k] += (r - 2) * q.w[k];
    else { const [, m, b] = q.a[r]; for (const k in m) sum[k] += m[k]; for (const t in b) bonus[t] = (bonus[t] || 0) + b[t]; }
  });
  const pos = {}; for (const k of ['x', 'y', 'd']) pos[k] = hi[k] === lo[k] ? 50 : Math.round((sum[k] - lo[k]) / (hi[k] - lo[k]) * 100);
  const ranked = TRIBES.map(t => ({ t, eff: dist(t, pos) - 9 * (bonus[t.id] || 0) })).sort((a, b) => a.eff - b.eff);
  return { top: ranked[0].t.id, ranked };
}
const opts = q => q.type === 'likert' ? 5 : q.a.length;
const rand = () => QUIZ.map(q => Math.floor(Math.random() * opts(q)));

const N = 100000, count = Object.fromEntries(TRIBES.map(t => [t.id, 0]));
for (let i = 0; i < N; i++) count[winner(rand()).top]++;

// Reachability: greedy search from random starts toward each tribe.
function reach(id) {
  for (let s = 0; s < 40; s++) {
    let ans = rand(), gap = score(ans);
    for (let pass = 0; pass < 6 && gap > 0; pass++) {
      for (let i = 0; i < QUIZ.length; i++) for (let o = 0; o < opts(QUIZ[i]); o++) {
        const old = ans[i]; ans[i] = o; const g = score(ans); if (g < gap) gap = g; else ans[i] = old;
      }
    }
    if (gap <= 0) return ans;
  }
  return null;
  function score(ans) { const { ranked } = winner(ans); const me = ranked.find(r => r.t.id === id).eff; return me - ranked.find(r => r.t.id !== id).eff + (ranked[0].t.id === id ? -1e-9 : 0); }
}
const unreachable = TRIBES.filter(t => !reach(t.id)).map(t => t.id);

console.log(`${QUIZ.length} questions (${QUIZ.filter(q => q.type === 'likert').length} statements), ${TRIBES.length} tribes`);
console.log('\nShare of 100,000 random quiz takers:');
for (const t of [...TRIBES].sort((a, b) => count[b.id] - count[a.id])) console.log(`  ${(count[t.id] / N * 100).toFixed(1).padStart(5)}%  ${t.name}`);
if (problems.length) console.log('\nData problems:\n  ' + problems.join('\n  '));
console.log(unreachable.length ? `\nUnreachable tribes: ${unreachable.join(', ')}` : '\nEvery tribe is reachable.');
process.exit(problems.length || unreachable.length ? 1 : 0);
