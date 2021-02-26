const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));


app.get("/imageboard", (req, res) => {
    db.getAllImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log(err));
});

app.listen(8080, () => console.log("IB up and running..."));
