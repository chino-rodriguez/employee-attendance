require('dotenv').config({ path: '.env.dev' });
const { Pool } = require("pg");

const devConfig = {
    host: process.env.INSTANCE_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const prodConfig = {
    host: process.env.INSTANCE_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionTimeoutMillis: 30000
};

// const pool = new Pool(
//     process.env.NODE_ENV === "production" ? prodConfig : devConfig
// );

//  No config needed when using Postgres' built-in environment variables
const pool = new Pool()


// DEBUG database connection
// pool.on('error', (e) => {
//     console.log('Pool connection error');
//     console.log(e, e.stack, e.message);
// });

// pool.on('connect', (res) => {
//     console.log('Connected to database');
//     if (process.env.NODE_ENV === "production") {
//         console.log(prodConfig);
//     } else console.log(devConfig);
// })

module.exports = {
    performQuery: (text) => {
        return pool.query(text);
    },
    pool
}