import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanName, validEntry } from "../filter.js";
import { TRIBE_IDS } from "../tribes.js";

test("takes one to three letters as initials, in capitals", () => {
  for (const [n, out] of [["CM", "CM"], ["c.m.", "CM"], ["C M", "CM"], ["jfk", "JFK"], ["É", "É"], ["zoë", "ZOË"], ["o’b", "OB"], ["Al", "AL"]]) {
    assert.deepEqual(cleanName(n), { name: out }, n);
  }
});
test("blocks profanity, slurs and hate symbols, including with periods and accents", () => {
  for (const n of ["ass", "A.S.S.", "kkk", "fag", "wtf", "Nig", "cum", "sex", "f.u.", "ÁSS", "xxx", "jew"]) {
    assert.equal(cleanName(n).code, "blocked", n);
  }
});
test("enforces length and letters only", () => {
  assert.equal(cleanName("").code, "empty");
  assert.equal(cleanName(" . ").code, "empty");
  assert.equal(cleanName("abcd").code, "too_long");
  assert.equal(cleanName("C.M.X.Y").code, "too_long");
  assert.equal(cleanName("Chris").code, "too_long");
  for (const n of ["123", "a1", "😀", "李", "a_b", "<b>"]) assert.equal(cleanName(n).code, "bad_chars", n);
});
test("moderator terms block anywhere", () => {
  assert.equal(cleanName("ZQX", ["zq"]).code, "blocked");
  assert.deepEqual(cleanName("BOB", ["zq"]), { name: "BOB" });
});
test("validEntry checks tribe, scores and token", () => {
  const ok = { tribe: "doomers", x: 4, y: 84, d: 75, token: "abcdefghijklmnop" };
  assert.equal(validEntry(ok, TRIBE_IDS).ok, true);
  assert.equal(validEntry({ ...ok, tribe: "nope" }, TRIBE_IDS).code, "bad_tribe");
  assert.equal(validEntry({ ...ok, x: 101 }, TRIBE_IDS).code, "bad_position");
  assert.equal(validEntry({ ...ok, y: 4.5 }, TRIBE_IDS).code, "bad_position");
  assert.equal(validEntry({ ...ok, d: "5" }, TRIBE_IDS).code, "bad_position");
  assert.equal(validEntry({ ...ok, token: "short" }, TRIBE_IDS).code, "bad_token");
  assert.equal(validEntry(null, TRIBE_IDS).code, "bad_request");
});
