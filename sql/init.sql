CREATE TABLE poi (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE TABLE events (
  id SERIAL NOT NULL PRIMARY KEY,
  poi_id INT NOT NULL REFERENCES poi (id),
  date DATE NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT
);

INSERT INTO poi (name) VALUES
  ('Charles Bridge'),
  ('Prague Castle'),
  ('Wenceslas Square'),
  ('National Museum'),
  ('Klementinum'),
  ('National Library'),
  ('Old Town Square'),
  ('Astronomical Clock'),
  ('St. Vitus Cathedral'),
  ('National Theatre');

INSERT INTO events (poi_id, date, title, description) VALUES
  (1, '1357-07-09', 'Construction started', 'Its construction started in 1357 under the auspices of King Charles IV, and finished in the beginning of the 15th century. The bridge replaced the old Judith Bridge built 1158–1172 that had been badly damaged by a flood in 1342. (wikipedia)'),
  (1, '2017-07-09', 'Celebration', 'Google celebrated the 660th anniversary of Charles Bridge with a Google Doodle. (wikipedia)');
  