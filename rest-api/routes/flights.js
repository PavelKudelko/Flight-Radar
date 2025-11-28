const express = require("express");
const router = express.Router();

const {
  getAllFligthData,
  getFlightByICAO,
  getRecentFlights,
  getLatestPosition,
  getFlightHistory,
  getMetaStats
} = require('../controllers/flightdataController');


router.get("/", (req, res) => {
  res.json({ message: 'Welcome to the Flights API' });
});

// get all with limit param, default = 100 lines
router.get("/getall/:limit", getAllFligthData);
router.get('/getbyicao/:id', getFlightByICAO);

// NEW API ROUTES
router.get("/recent", getRecentFlights);
router.get("/:icao/latest", getLatestPosition);
router.get("/:icao/history", getFlightHistory);
// get db stats (for troubleshooting and monitoring)
router.get("/meta/stats", getMetaStats);


module.exports = router;
