const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

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

app.use(express.json());

app.get("/imageboard", (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
});

app.get("/imageboard/:selection", (req, res) => {
    console.log("Requested Card Id", req.params.selection);
    db.getSelectedImage(req.params.selection)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
});

app.get("/comments/:selection", (req, res) => {
    console.log("Requested Image Id", req.params.selection);
    db.getSelectedComments(req.params.selection)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
});

app.post("/addcomment", (req, res) => {
    console.log("comments body", req.body);
    const { username, img_id, comment } = req.body;

    db.addComment(username, img_id, comment)
        .then(({ rows }) => {
            res.json({ postedComment: rows[0] });
        })
        .catch(function (err) {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { url, username, title, description } = req.body;
    const { filename } = req.file;
    const upload = {
        url: s3Url + filename,
        username: username,
        title: title,
        descripton: description,
    };

    if (req.file) {
        db.addImage(s3Url + filename, username, title, description).then(
            ({ rows }) => {
                upload.id = rows.id;
                res.json({ uploadedFile: upload });
            }
        );
    } else {
        res.json({
            success: false,
        });
    }
});

let server = app.listen(process.env.PORT || 8080, () =>
    console.log(`🟢 Listening Port ${server.address().port} ... ~ Imageboard ~`)
);
