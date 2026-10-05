// Name rules for the wall. The page inlines a copy of this file at build time, so keep it free of Worker APIs.

// The wall takes initials only: one to three Latin letters, stored in capitals. Periods and spaces are dropped ("c.m." is CM).
export const MAX_NAME = 3;

// Three-letter (and shorter) combinations that read as profanity, slurs or hate symbols.
const BLOCKED = ["ass", "azz", "arse", "fag", "fap", "fuk", "fuc", "fck", "fux", "fuq", "sht", "cnt", "cun", "cum", "coc", "cok", "dik", "dic",
  "dix", "tit", "twt", "nig", "ngr", "nga", "kkk", "kke", "jew", "gay", "dyk", "sex", "xxx", "poo", "pee", "pis", "wtf", "kys", "stf",
  "hoe", "slt", "vag", "jiz", "wop", "naz", "anl", "fu", "kys"];

const letters = s => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function cleanName(raw, extraTerms = []) {
  const n = String(raw == null ? "" : raw).normalize("NFKC").replace(/[\s.\-'’]+/g, "").normalize("NFC").toUpperCase();
  if (!n) return { err: "Add your initials.", code: "empty" };
  if (!/^\p{Script=Latin}+$/u.test(n)) return { err: "Use letters only.", code: "bad_chars" };
  if ([...n].length > MAX_NAME) return { err: `Up to ${MAX_NAME} letters.`, code: "too_long" };
  const flat = letters(n), extra = (extraTerms || []).map(letters).filter(Boolean);
  if (BLOCKED.includes(flat) || extra.some(t => flat.includes(t))) return { err: "Those letters aren’t allowed. Try a different combination.", code: "blocked" };
  return { name: n };
}

export function validEntry(body, tribeIds) {
  if (!body || typeof body !== "object") return { ok: false, code: "bad_request", message: "Send a JSON object." };
  if (!tribeIds.includes(body.tribe)) return { ok: false, code: "bad_tribe", message: "Unknown tribe." };
  for (const k of ["x", "y", "d"]) {
    const v = body[k];
    if (!Number.isInteger(v) || v < 0 || v > 100) return { ok: false, code: "bad_position", message: "Scores must be whole numbers from 0 to 100." };
  }
  if (typeof body.token !== "string" || !/^[A-Za-z0-9_-]{16,64}$/.test(body.token)) return { ok: false, code: "bad_token", message: "Missing browser token." };
  return { ok: true, entry: { tribe: body.tribe, x: body.x, y: body.y, d: body.d, token: body.token } };
}
