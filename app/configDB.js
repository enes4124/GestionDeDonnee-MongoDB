const mongo = require("mongodb");
const fs = require("fs");
const { get } = require("http");

const MongoClient = mongo.MongoClient;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

const client = new MongoClient(uri);

const uriApiParkingNancy =
  "https://geoservices.grand-nancy.org/arcgis/rest/services/public/VOIRIE_Parking/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=nom%2Cadresse%2Cplaces%2Ccapacite&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson";

// fetch data for parking
async function getParking() {
  return fetch(uriApiParkingNancy)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

// create new database
async function createDatabaseParking(dataParking) {
  try {
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

    const collectionBike = database.collection("bike");
    const resultBike = await collectionBike.find(query, options).toArray();

    if (resultBike.length === 0) {
      console.log("Database Bike doesn't exist, creating it...");
      const data = JSON.parse(fs.readFileSync("./json/bike.json", "utf8"));
      await collectionBike.insertOne(data);
    } else {
      console.log("Database Bike already exists");
    }

    const collectionBus = database.collection("bus");
    const resultBus = await collectionBus.find(query, options).toArray();

    if (resultBus.length === 0) {
      console.log("Database Bus doesn't exist, creating it...");
      const data = JSON.parse(fs.readFileSync("./json/bus.json", "utf8"));
      await collectionBus.insertOne(data);
    } else {
      console.log("Database Bus already exists");
    }
  } catch (e) {
    console.error("error", e);
  } finally {
    await client.close();
  }
}

function configDB() {
  getParking().then((data) => {
    createDatabaseParking(data);
  });
}

module.exports = {
  configDB,
};
