const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');
const {s3Url} = require('./config');

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `O Brother, Where @rt Thou?`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.urlencoded({ extended: false }));

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

// app.get("/login", (req, res) => {
//     if (req.session.login) {
//         res.redirect("/imageboard");
//     } else {
//         res.render(`<h1>Access to this Page is not allowed without Password.</h1>
//     `);
//     }
// });

// app.post("/imageboard", (req, res) => {
//     if (req.body.password) {
//         console.log("PASSWORD", req.body.password)
//         compare(req.body.password, OBrotherWhereartThou_7457545754756).then(
//             (match) => {
//                 if (match) {
//                     req.session.login = true;
//                     this.seen = true;
//                     this.login = false;
//                 }
//             }
//         );           
         
//     } else {
//         return
//     }
// });


app.get("/imageboard", (req, res) => {
    // if (req.session.login) {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
    // }
    // else {
    //    
    // }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const {url, username, title, description} = req.body;
    const {filename} = req.file;
    const upload = {
        url: s3Url + filename,
        username: username,
        title: title,
        descripton: description,
    };
    
    if (req.file) {
       db.addImage(s3Url + filename, username, title, description).then(({rows}) =>
       {
            upload.id=rows.id;
            res.json({ uploadedFile: upload });
       })
    } else {
        res.json({
            success: false,
        });
    }
});

let server = app.listen(process.env.PORT || 8080, () =>
    console.log(`🟢 Listening Port ${server.address().port} ... ~ Imageboard ~`)
);
