
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner INTEGER NOT NULL,
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
  livePageVisible INTEGER,
  avatar BLOB
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
);

CREATE TABLE usedTokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  token TEXT NOT NULL
);

INSERT INTO users (userName, password, userGroup, liveStreamPlugin, eMail)
VALUES ("fabian", "$5$rounds=535000$G0IQDc7262yQyK.S$rEJ0staMve0K3QCLRfQ.awXap1FGMwLOm/rlO26KMV8", 0, 1, "mail@fabian-decker.de");

