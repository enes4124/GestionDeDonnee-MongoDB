const express = require("express");

const port = 3000;

const app = express();

const config = require("./configDB");
config.configDB();


const parking = require("./routes/parking");
const bike = require("./routes/bike");
const bus = require("./routes/bus");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.use("/parking", parking);

app.use("/bike", bike);

app.use("/bus", bus);

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/src/main.js");
});

app.use((req, res, next) => {
    res.status(404).send("Page introuvable");
});

app.get("/:catchall", (req, res) => {
    res.sendFile(__dirname + "/error/error.html");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
