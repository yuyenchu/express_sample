USE web_fragments;

DROP TABLE IF EXISTS web_components;
CREATE TABLE web_components (
    id VARCHAR(30) PRIMARY KEY,
    html BOOLEAN NOT NULL,
    css BOOLEAN NOT NULL,
    javascript BOOLEAN NOT NULL,
    html_content TEXT,
    css_content TEXT,
    javascript_content TEXT,
    aurthor VARCHAR(20),
    descriptions VARCHAR(50),
    updated DATETIME NOT NULL -- format: 'YYYY-mm-dd HH:ii:ss'
);