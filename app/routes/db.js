const express = require("express");

const app = express.Router();

const db = require("../model/nancyty");

app.get("/", (req, res) => {
  try {
    db.getData()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get("/fields", (req, res) => {
    try {
        db.getFields()
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.get("/features", (req, res) => {
    try {
        db.getFeatures()
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({ error: err });
            });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = app;