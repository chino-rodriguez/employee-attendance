const dotenv = require('dotenv');
const { Pool } = require("pg");

let dbConfig = {};

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.dev' }); // .env.dev in top-level directory "app"
    dbConfig = {
        host: "localhost",
        port: process.env.DBPORT,
        user: process.env.DBUSER,
        database: process.env.DBNAME
    }
} else {
    dotenv.config({ path: '.env.prod' });
    dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
}


const pool = new Pool(dbConfig);

pool.on('error', (e) => {
    console.log(e, e.stack, e.message);
});

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    },
    pool
}