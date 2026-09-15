CREATE TABLE persons (
  id TEXT PRIMARY KEY,
  name TEXT,
  household_id TEXT,
  identity_token TEXT,
  legitimacy_score INTEGER,
  tier TEXT
);

CREATE TABLE households (
  id TEXT PRIMARY KEY,
  address TEXT,
  neighbourhood_id TEXT,
  legitimacy_score INTEGER
);

CREATE TABLE neighbourhoods (
  id TEXT PRIMARY KEY,
  name TEXT,
  legitimacy_score INTEGER
);

CREATE TABLE civic_signals (
  id TEXT PRIMARY KEY,
  type TEXT,
  from_person_id TEXT,
  household_id TEXT,
  neighbourhood_id TEXT,
  payload TEXT,
  created_at TEXT
);
