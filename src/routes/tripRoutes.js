const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById } = require('../controllers/tripController');

// GET all trips
router.get('/', getAllTrips);

// GET single trip by ID
router.get('/:id', getTripById);

module.exports = router;
