/** regex to match a string that contains both 'butterfly' and 'crazy' 
^(?=.*\bbutterfly\b)(?=.*\bcrazy\b).*"
 */

/*
notes

App is a page with a list on it. 
Components
List
ListItem - row with two text fields, several buttons

Buttons - 


DATABASE

CREATE TABLE Songs (
    id VARCHAR(255) PRIMARY KEY,
    artist VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    year INT,
    rank INT,
    genre VARCHAR(255),
    releaseYear INT,
    played DATE,
    isInLibrary BOOLEAN DEFAULT FALSE,
    neverPlay BOOLEAN DEFAULT FALSE,
    FULLTEXT(artist, title)
) ENGINE=InnoDB;
 
SELECT * FROM Songs
WHERE MATCH(artist, title) AGAINST('+Nirvana' IN BOOLEAN MODE);


*/