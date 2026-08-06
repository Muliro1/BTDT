const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { AppError } = require('../middleware/errorHandler');
const {
  // API Controllers
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  // View Controllers
  renderTrips,
  renderCreateForm,
  renderEditForm,
  renderTripDetail
} = require('../controllers/tripController');

// ============ VIEW ROUTES (HTML) ============
// These render Pug templates for the browser

// Home / List View - GET /trips
router.get('/trips', renderTrips);

// Create Form - GET /trips/create
router.get('/trips/create', renderCreateForm);

// Edit Form - GET /trips/:id/edit
router.get('/trips/:id/edit', renderEditForm);

// Detail View - GET /trips/:id
router.get('/trips/:id', renderTripDetail);

// ============ HTML FORM SUBMISSIONS ============
// These handle form submissions and redirect to HTML views

// CREATE via form - POST /trips
router.post('/trips', async (req, res, next) => {
  try {
    // Convert textarea lines to arrays
    if (req.body.highlights) {
      req.body.highlights = req.body.highlights
        .split('\n')
        .filter(item => item.trim() !== '');
    }
    if (req.body.photos) {
      req.body.photos = req.body.photos
        .split('\n')
        .filter(item => item.trim() !== '');
    }

    await Trip.create(req.body);
    res.redirect('/trips?success=Trip created successfully!');
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.render('trips/create', {
        title: 'Add New Trip',
        trip: req.body,
        errors
      });
    }
    next(error);
  }
});

// UPDATE via form - PUT /trips/:id
router.put('/trips/:id', async (req, res, next) => {
  try {
    // Convert textarea lines to arrays
    if (req.body.highlights) {
      req.body.highlights = req.body.highlights
        .split('\n')
        .filter(item => item.trim() !== '');
    }
    if (req.body.photos) {
      req.body.photos = req.body.photos
        .split('\n')
        .filter(item => item.trim() !== '');
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.redirect(`/trips/${req.params.id}?success=Trip updated successfully!`);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      const trip = await Trip.findById(req.params.id);
      return res.render('trips/edit', {
        title: `Edit ${trip.destination}`,
        trip: req.body,
        errors
      });
    }
    next(error);
  }
});

// DELETE via form - DELETE /trips/:id
router.delete('/trips/:id', async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    await trip.deleteOne();
    res.redirect('/trips?success=Trip deleted successfully!');
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
});

// ============ API ROUTES (JSON) ============
// These return JSON for API clients

// CREATE - POST /api/trips
router.post('/api/trips', createTrip);

// READ all - GET /api/trips
router.get('/api/trips', getAllTrips);

// READ one - GET /api/trips/:id
router.get('/api/trips/:id', getTripById);

// UPDATE - PUT /api/trips/:id
router.put('/api/trips/:id', updateTrip);

// DELETE - DELETE /api/trips/:id
router.delete('/api/trips/:id', deleteTrip);

// ============ API INFO (JSON) ============
router.get('/', (req, res) => {
  res.json({
    message: 'Travel Journal API',
    version: '1.0.0',
    endpoints: {
      // View routes (HTML)
      'GET /trips': 'View all trips (HTML)',
      'GET /trips/create': 'Create form (HTML)',
      'GET /trips/:id/edit': 'Edit form (HTML)',
      'GET /trips/:id': 'Trip detail (HTML)',
      'POST /trips': 'Create via form (HTML)',
      'PUT /trips/:id': 'Update via form (HTML)',
      'DELETE /trips/:id': 'Delete via form (HTML)',
      // API routes (JSON)
      'GET /api/trips': 'Get all trips (JSON)',
      'GET /api/trips/:id': 'Get single trip (JSON)',
      'POST /api/trips': 'Create a trip (JSON)',
      'PUT /api/trips/:id': 'Update a trip (JSON)',
      'DELETE /api/trips/:id': 'Delete a trip (JSON)'
    }
  });
});

console.log('✅ Trip routes registered:');
console.log('   POST /trips          - Create via form (HTML)');
console.log('   PUT /trips/:id       - Update via form (HTML)');
console.log('   DELETE /trips/:id    - Delete via form (HTML)');
console.log('   POST /api/trips      - Create via API (JSON)');
console.log('   PUT /api/trips/:id   - Update via API (JSON)');
console.log('   DELETE /api/trips/:id - Delete via API (JSON)');

module.exports = router;
