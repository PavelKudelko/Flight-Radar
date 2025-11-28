const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(morgan('dev'));

// Import and mount routes
const flightRoutes = require('./routes/flights');
app.use('/api/flights', flightRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});

// Start server
const run_app = () => {
  app.listen(PORT, () => {
    console.log(`🚀 API is listening on http://localhost:${PORT}`);
  });
};

run_app();
