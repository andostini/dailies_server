
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mapWaste_clip TEXT,
  mapNormal_take TEXT,
  mapGood_take TEXT,
  mapFav_take TEXT,
  cameraA TEXT,
  cameraB TEXT,
  cameraC TEXT,
  cameraD TEXT,
  libraryPageVisible INTEGER,
  livePageVisible INTEGER
);


CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userName TEXT NOT NULL,
  password TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastLogin TEXT,
  userGroup INTEGER NOT NULL,
  name TEXT,
  eMail TEXT NOT NULL,
  phone TEXT,
  billing TEXT,
  maxGB INT,
  maxProjectNumber INT,
  expirationDate TEXT,
  liveStreamPlugin INT,
  avatar BLOB
)