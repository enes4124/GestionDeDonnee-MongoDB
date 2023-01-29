const knex = require('knex')

let db = knex({
    client: 'mongodb',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
})

function getData() {
    return db('nancyty').select('*')
}

module.exports = {
    getData
}
