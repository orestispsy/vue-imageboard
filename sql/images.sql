DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
    'funkychicken',
    'Welcome to Spiced and the Future!',
    'This photo brings back so many great memories.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/imageboard/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'To be or not to be',
    'That is the question.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/AxExni7J3Rga6o5RMRQENLVuvhUz3zk3.jpg',
    'no one knows',
    'Look what is happening',
    'When you sleep'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/e6ewSiKpP1JAngVUQWg0h2dpK-2oJgGP.jpg',
    'no one knows',
    'Satelite transmitions',
    'A Story about how to be above someones head...'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/tcHLJ-Zii7BAYqUpxWg-qKwNo6B4WrgN.jpg',
    '1000mods',
    'SFTU',
    '1000mods'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/XwwJsgaR_sqp1_O__PVyIJoAWi0X-AJg.jpg',
    'test',
    'Aegean Wine',
    'Sundown'
);