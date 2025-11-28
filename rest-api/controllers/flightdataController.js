const clientDB = require('../config/db');

const getAllFligthData = async (req, res) => {
  const limit = req.params.limit || 100;
  try {
    const result = await clientDB.query(`SELECT * FROM aircraft_positions ORDER BY timestamp DESC LIMIT $1`, [limit]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Query failed:", err.message);
    res.status(500).json({ error: "Database query failed" });
  }
};

const getFlightByICAO = async (req, res) => {
  console.log("get flight by id matched: ", req.params.id)

  const id = req.params.id;
  try {
    const result = await clientDB.query(`SELECT * FROM aircraft_positions WHERE icao = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flight" });
  }
};

// recent flughts
const getRecentFlights = async (req, res) => {
  // last 30 mins or query pamram
  const since = req.query.since || new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const limit = req.query.limit || 100;
  try {
    const result = await clientDB.query(
      `SELECT * FROM aircraft_positions WHERE timestamp > $1 ORDER BY timestamp DESC LIMIT $2`,
      [since, limit]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent flights" });
  }
};

// latest position of a flight by icao
const getLatestPosition = async (req, res) => {
  const icao = req.params.icao;
  try {
    const result = await clientDB.query(
      `SELECT * FROM aircraft_positions WHERE icao = $1 ORDER BY timestamp DESC LIMIT 1`,
      [icao]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "No data for this flight" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest position" });
  }
};

// get flight history by icao between start and end
const getFlightHistory = async (req, res) => {
  const icao = req.params.icao;
  const start = req.query.start;
  const end = req.query.end || new Date().toISOString();

  if (!start) return res.status(400).json({ error: "Missing required 'start' query param" });

  try {
    const result = await clientDB.query(
      `SELECT * FROM aircraft_positions WHERE icao = $1 AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp ASC`,
      [icao, start, end]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flight history" });
  }
};

const getMetaStats = async (req, res) => {
  try {
    const countResult = await clientDB.query(`SELECT COUNT(*) FROM aircraft_positions`);
    const sizeResult = await clientDB.query(`SELECT pg_size_pretty(pg_total_relation_size('aircraft_positions')) AS size`);

    res.status(200).json({
      row_count: parseInt(countResult.rows[0].count),
      db_size: sizeResult.rows[0].size
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
};

module.exports = {
  getAllFligthData,
  getFlightByICAO,
  getRecentFlights,
  getLatestPosition,
  getFlightHistory,
  getMetaStats
};
