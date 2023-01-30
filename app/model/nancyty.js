const { MongoClient } = require("mongodb");

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`

const client = new MongoClient(uri)

async function getData() {
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('parking')
        const query = {}
        const options = {}
        const result = await collection.find(query, options).toArray()
        return result
    } catch (e) {
        console.error("error", e)
    } finally {
        await client.close()
    }
}

async function getFields() {
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('parking')
        const query = {}
        const options = {
            projection: {
                _id: 0,
                "fields": 1
            }
        }
        const result = await collection.find(query, options).toArray()
        return result
    } catch (e) {
        console.error("error", e)
    } finally {
        await client.close()
    }
}

async function getFeatures() {
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('parking')
        const query = {}
        const options = {
            projection: {
                _id: 0,
                "features": 1
            }
        }
        const result = await collection.find(query, options).toArray()
        return result[0].features
    } catch (e) {
        console.error("error", e)
    } finally {
        await client.close()
    }
}

async function getBike() { 
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('bike')
        const query = {}
        const options = {
            projection: {
                _id: 0,
                "data.stations": 1
            }
        }
        const result = await collection.find(query, options).toArray()
        return result[0].data.stations
    } catch (e) {
        console.error("error", e)
    } finally {
        await client.close()
    }
}

async function getBus() {
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('bus')
        const query = {}
        const options = {}
        const result = await collection.find(query, options).toArray()
        return result[0].features
    } catch (e) {
        console.error("error", e)
    } finally {
        await client.close()
    }
}


module.exports = {
    getData,
    getFields,
    getFeatures,
    getBike,
    getBus
}
