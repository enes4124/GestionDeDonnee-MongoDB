const express = require("express");

const port = 3000;

const app = express();

const db = require("./routes/db");

app.use("/nancy", db);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/src/main.js");
});

app.get("/:catchall", (req, res) => {
    res.sendFile(__dirname + "/error/error.html");
});

app.use((req, res, next) => {
    console.log("Une requête a été faite");
    next();
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
