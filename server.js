const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');
const {s3Url} = require('./config');

app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});


app.get("/imageboard", (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const {url, username, title, description} = req.body;
    const {filename} = req.file;
    db.addImage(s3Url + filename, username, title, description);

});

let server = app.listen(process.env.PORT || 8080, () =>
    console.log(`🟢 Listening Port ${server.address().port} ... ~ Imageboard ~`)
);
