require('dotenv').config({ path: '.env.dev' });
const { Pool } = require("pg");

const devConfig = {
    host: "localhost",
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    database: process.env.DBNAME
};

const prodConfig = {
    connectionString: process.env.DATABASE_URL
};

const pool = new Pool(
    process.env.NODE_ENV === "production" ? prodConfig : devConfig
);

pool.on('error', (e) => {
    console.log(e, e.stack, e.message);
});

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    },
    pool
}