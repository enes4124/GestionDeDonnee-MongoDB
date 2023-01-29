const { MongoClient } = require("mongodb");

// const uri = "mongodb://root:password@tdmongo:27017/nancyty?authSource=admin";
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`

const client = new MongoClient(uri)

async function getData() {
    try {
        await client.connect()
        const database = client.db('nancyty')
        const collection = database.collection('nancyty')
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

module.exports = {
    getData
}
