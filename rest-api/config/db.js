const { Client } = require("pg");
require('dotenv').config();

const clientDB = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE
});

clientDB.connect()
    .then(() => {
    console.log("Connected to Flight Radar Database");
    })
    .catch((err) => {
    console.error("Error connecting to Flight Radar Database:", err.message);
    });

module.exports = clientDB
