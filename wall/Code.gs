/**
 * FAI Field Guide: the wall.
 * A Google Apps Script web app that stores quiz results in this Google Sheet.
 *
 * Setup:
 * 1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 * 2. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 3. Copy the web app URL into WALL.SHEET_URL in index.html.
 *
 * Moderation: type HIDE in column G of any row to remove it from the wall,
 * or delete the row.
 */
const SHEET_NAME = "Sightings";
const HEADERS = ["timestamp", "name", "tribe", "speed", "steering", "destination", "hidden"];
const MAX_ROWS_RETURNED = 1000;
const MAX_WRITES_PER_MINUTE = 30;
const BLOCK = ["fuck","shit","cunt","nigg","fag","retard","rape","nazi","hitler","kike","spic","chink","whore","slut","dick","cock","pussy","porn"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sh.getName() !== SHEET_NAME) sh.setName(SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const out = rows
    .filter(r => String(r[6]).trim().toUpperCase() !== "HIDE" && r[6] !== true)
    .slice(-MAX_ROWS_RETURNED)
    .map(r => ({ ts: new Date(r[0]).getTime(), name: String(r[1]), tribe: String(r[2]),
                 x: Number(r[3]), y: Number(r[4]), d: Number(r[5]) }));
  return json_(out);
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    const name = String(b.name || "").replace(/\s+/g, " ").trim().slice(0, 20);
    const flat = name.toLowerCase().replace(/[^a-z]/g, "");
    const nums = [b.x, b.y, b.d].map(Number);
    if (!name || !/^[\p{L}\p{N} .'\-]+$/u.test(name) || name.split(" ").length > 2) return json_({ ok: false, error: "bad name" });
    if (BLOCK.some(w => flat.includes(w))) return json_({ ok: false, error: "bad name" });
    if (!/^[a-z]{2,20}$/.test(String(b.tribe))) return json_({ ok: false, error: "bad tribe" });
    if (nums.some(n => !(n >= 0 && n <= 100))) return json_({ ok: false, error: "bad position" });

    const cache = CacheService.getScriptCache();
    const key = "w" + Math.floor(Date.now() / 60000);
    const count = Number(cache.get(key) || 0);
    if (count >= MAX_WRITES_PER_MINUTE) return json_({ ok: false, error: "busy" });
    cache.put(key, String(count + 1), 120);

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try { sheet_().appendRow([new Date(), name, String(b.tribe), nums[0], nums[1], nums[2], ""]); }
    finally { lock.releaseLock(); }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server" });
  }
}
