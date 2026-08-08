const express = require('express');
const router = express.Router();
const { uploadPhotos } = require('../config/upload');
const {
  createTripFromForm,
  updateTripFromForm,
  deleteTrip,
  renderTrips,
  renderCreateForm,
  renderEditForm,
  renderTripDetail
} = require('../controllers/tripController');

// ============ VIEW ROUTES ============
router.get('/trips', renderTrips);
router.get('/trips/create', renderCreateForm);
router.get('/trips/:id/edit', renderEditForm);
router.get('/trips/:id', renderTripDetail);

// ============ FORM SUBMISSIONS (with file upload) ============
router.post('/trips', uploadPhotos, createTripFromForm);
router.put('/trips/:id', uploadPhotos, updateTripFromForm);
router.delete('/trips/:id', deleteTrip);

// ============ HOME ============
router.get('/', (req, res) => {
  res.json({
    message: 'Travel Journal',
    version: '1.0.0',
    endpoints: {
      'GET /trips': 'View all trips',
      'GET /trips/create': 'Create form',
      'GET /trips/:id/edit': 'Edit form',
      'GET /trips/:id': 'Trip detail',
      'POST /trips': 'Create with file upload',
      'PUT /trips/:id': 'Update with file upload',
      'DELETE /trips/:id': 'Delete a trip'
    }
  });
});

module.exports = router;
