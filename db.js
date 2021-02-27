const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getAllImages = () => {
    const q = `
        SELECT * FROM images;
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