
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
