const express = require("express");
const mongo = require("mongodb");

const app = express.Router();

const db = require("../model/nancyty");

const MongoClient = mongo.MongoClient;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

const client = new MongoClient(uri);

const uriApiParkingNancy =
  "https://geoservices.grand-nancy.org/arcgis/rest/services/public/VOIRIE_Parking/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=nom%2Cadresse%2Cplaces%2Ccapacite&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson";

async function setParking() {
  fetch(uriApiParkingNancy)
    .then((res) => res.json())
    .then(async (dataParking) => {
      await client.connect();
      const query = {};
      const options = {};
      const database = client.db("nancyty");

      const collectionParking = database.collection("parking");
      const resultParking = await collectionParking
        .find(query, options)
        .toArray();

      if (resultParking.length === 0) {
        console.log("Database Parking doesn't exist, creating it...");
        await collectionParking.insertOne(dataParking);
      } else {
        console.log("Database Parking already exists");
        console.log("Deleting all documents in database Parking...");
        console.log("Inserting new data in database Parking...");
        collectionParking.deleteMany({});
        await collectionParking.insertOne(dataParking);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

app.get("/features", (req, res) => {
  try {
    setParking();
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
