const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// check the db connection
pool.connect()
    .then((client) => {
        console.log('Connected to the database');
        client.release();
    })
    .catch((err) => {
        console.warn('Could not connect to DB at startup:', err.message);
    });

module.exports = {
    Query: {
        // all data with limit (limit required)
        aircraftPositions: async (_, { limit }) => {
            try {
                const res = await pool.query(
                    `SELECT * FROM aircraft_positions ORDER BY timestamp DESC LIMIT $1`,
                    [limit]
                );
                return res.rows;
            } catch (err) {
                console.error('DB error:', err.message);
            }
        },
        // data by ICAO (limit required)
        aircraftByICAO: async (_, { icao, limit }) => {
            try {
                const res = await pool.query(
                    `SELECT * FROM aircraft_positions WHERE icao = $1 ORDER BY timestamp DESC LIMIT $2`,
                    [icao, limit]
                );
                return res.rows;
            } catch (err) {
                console.error('DB error', err.message);
            }
        },
        // data by flight numner (limit required)
        aircraftByFlight: async (_, { flight, limit }) => {
            try {
                const res = await pool.query(
                    `SELECT * FROM aircraft_positions WHERE flight = $1 ORDER BY timestamp DESC LIMIT $2`,
                    [flight, limit]
                );
                return res.rows;
            } catch (err) {
                console.error('DB error', err.message);
            }
        },
    },
};