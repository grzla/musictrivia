const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'joom',
  database: 'musictriviatest'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

const queryImportLibrary = `
  LOAD DATA INFILE '/home/greg/Documents/wrikMusicTrivia/librarySongs.tsv'
  INTO TABLE librarysongs
  FIELDS TERMINATED BY '\t' 
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (Artist, Title, ReleaseYear);
`;

const queryImportBillboard = `
  LOAD DATA INFILE '/home/greg/Documents/wrikMusicTrivia/import/billboard/1983.tsv'
  INTO TABLE billboard
  FIELDS TERMINATED BY '\t' 
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (@dummy, Ranking, Artist, Title, Played);
`;

const submitQuery = query => connection.query(query, (err, result) => {
  if (err) throw err;
  console.log('Data imported successfully.');
});

submitQuery(queryImportLibrary);
submitQuery(queryImportBillboard);
/**
CREATE DATABASE musictriviatest;

USE musictriviatest;

CREATE TABLE librarysongs (
  id INT AUTO_INCREMENT,
  Artist VARCHAR(100),
  Title VARCHAR(100),
  ReleaseYear SMALLINT,
  PRIMARY KEY (id)
);

---> LOAD LIBRARYSONGS.TSV INTO TABLE

-- Create normalized versions of your columns
ALTER TABLE librarysongs ADD COLUMN Title_normalized VARCHAR(100);
ALTER TABLE librarysongs ADD COLUMN Artist_normalized VARCHAR(100);

UPDATE librarysongs 
SET Artist_normalized = LOWER(REPLACE(REPLACE(artist, '.', ''), ',', '')),
    Title_normalized = LOWER(REPLACE(REPLACE(title, '.', ''), ',', ''));

-- Create full-text indexes
ALTER TABLE librarysongs ADD FULLTEXT(Artist_normalized, Title_normalized);

CREATE TABLE billboard (
  id INT AUTO_INCREMENT,
  Ranking SMALLINT,
  Artist VARCHAR(100),
  Title VARCHAR(100),
  Year SMALLINT,
  ReleaseYear SMALLINT,
  Played TINYINT,
  PRIMARY KEY (id)
);
*/
