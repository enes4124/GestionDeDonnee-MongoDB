const express = require("express");

const port = 3000;

const app = express();

const db = require("./routes/db");

app.use("/", db);

app.use((req, res, next) => {
    console.log("Une requête a été faite");
    next();
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
