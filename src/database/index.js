const { Client } = require('pg');
const dotenv = require('dotenv')

dotenv.config()

const client = new Client({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
});

const connect = () => {

    client
        .connect()
        .then(() => {
            // console.log('Connected to PostgreSQL database');
        })
        .catch((err) => {
            console.error('Error connecting to PostgreSQL database', err);
        });

}

module.exports = {
    client,
    connect
}