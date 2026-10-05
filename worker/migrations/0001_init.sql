-- Quiz takers who signed the wall. No IPs or emails are stored; token_hash is a hash of a random per-browser token.
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  tribe TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  d INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  moderated_by TEXT,
  moderated_at INTEGER
);
CREATE INDEX entries_created ON entries (created_at DESC);
CREATE INDEX entries_visible ON entries (hidden, created_at DESC);

-- Extra blocked words added by moderators, matched anywhere in a name.
CREATE TABLE blocked_terms (
  term TEXT PRIMARY KEY,
  added_by TEXT,
  added_at INTEGER NOT NULL
);
