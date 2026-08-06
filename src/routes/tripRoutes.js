const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById } = require('../controllers/tripController');

// ============ HOME ROUTE ============
router.get('/', (req, res) => {
  res.json({
    message: 'Travel Journal API',
    version: '1.0.0',
    endpoints: {
      'GET /trips': 'Get all trips',
      'GET /trips/:id': 'Get single trip by ID'
    }
  });
});

// ============ TRIP ROUTES ============

// GET all trips
router.get('/trips', getAllTrips);

// GET single trip by ID
router.get('/trips/:id', getTripById);

module.exports = router;
