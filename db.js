const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getAllImages = () => {
    const q = `
        SELECT * FROM images
        ORDER BY id DESC
        LIMIT 6
    `;
    return db.query(q);
};

module.exports.addImage = (url, username, title, description) => {
    const q = `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description
    `;
    const params = [url, username, title, description];
    console.log("q: ", q);
    return db.query(q, params);
};

module.exports.getSelectedImage = (id) => {
    const q = `
        SELECT * FROM images WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.getSelectedComments = (id) => {
    const q = `
        SELECT * FROM comments WHERE img_id = $1
        ORDER BY id DESC
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.addComment = (username, img_id, comment) => {
    const q = `
        INSERT INTO comments (username, img_id, comment)
        VALUES ($1, $2, $3)
        RETURNING id, username, img_id, comment, created_at
    `;
    const params = [username, img_id, comment];
    console.log("q: ", q);
    return db.query(q, params);
};

module.exports.getNextRes = (id) => {
    const q = `
        SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6;
    `;
    const params = [id];
    return db.query(q, params);
};

