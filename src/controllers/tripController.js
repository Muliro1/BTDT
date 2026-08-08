const Trip = require('../models/Trip');
const { AppError } = require('../middleware/errorHandler');

// Helper: Get photo URLs from uploaded files
const getPhotoUrls = (files) => {
  if (!files || files.length === 0) return [];
  return files.map(file => `/uploads/${file.filename}`);
};

// ============ CREATE ============
const createTripFromForm = async (req, res, next) => {
  try {
    // Check if photos were uploaded
    if (!req.files || req.files.length === 0) {
      return res.render('trips/create', {
        title: 'Add New Trip',
        trip: req.body,
        errors: ['Please upload at least one photo.']
      });
    }

    // Convert highlights from textarea to array
    if (req.body.highlights) {
      req.body.highlights = req.body.highlights
        .split('\n')
        .filter(item => item.trim() !== '');
    }
    
    // Get photo URLs from uploaded files
    const photoUrls = getPhotoUrls(req.files);
    
    // Create trip data
    const tripData = {
      destination: req.body.destination,
      country: req.body.country,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      photos: photoUrls,
      highlights: req.body.highlights || [],
      rating: req.body.rating || 3,
      budget: req.body.budget || 0,
      notes: req.body.notes || ''
    };

    await Trip.create(tripData);
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
};

// ============ UPDATE ============
const updateTripFromForm = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    // Convert highlights from textarea to array
    if (req.body.highlights) {
      req.body.highlights = req.body.highlights
        .split('\n')
        .filter(item => item.trim() !== '');
    }
    
    // Get photo URLs from uploaded files (replace all existing)
    const photoUrls = getPhotoUrls(req.files);
    
    // Update trip data
    const tripData = {
      destination: req.body.destination,
      country: req.body.country,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      photos: photoUrls.length > 0 ? photoUrls : trip.photos, // Keep existing if no new uploads
      highlights: req.body.highlights || [],
      rating: req.body.rating || 3,
      budget: req.body.budget || 0,
      notes: req.body.notes || ''
    };
    
    await Trip.findByIdAndUpdate(
      req.params.id,
      tripData,
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
};

// ============ DELETE ============
const deleteTrip = async (req, res, next) => {
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
};

// ============ VIEW RENDERERS ============
const renderTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.render('trips/index', {
      title: 'My Travel Journal',
      trips,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    next(error);
  }
};

const renderCreateForm = (req, res) => {
  res.render('trips/create', {
    title: 'Add New Trip',
    trip: {},
    errors: null
  });
};

const renderEditForm = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    res.render('trips/edit', {
      title: `Edit ${trip.destination}`,
      trip,
      errors: null
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
};

const renderTripDetail = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    res.render('trips/show', {
      title: trip.destination,
      trip
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
};

module.exports = {
  createTripFromForm,
  updateTripFromForm,
  deleteTrip,
  renderTrips,
  renderCreateForm,
  renderEditForm,
  renderTripDetail
};
