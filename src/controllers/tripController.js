const Trip = require('../models/Trip');
const { AppError } = require('../middleware/errorHandler');

// ============ API CONTROLLERS (JSON Responses) ============

// CREATE - Add new trip
const createTrip = async (req, res, next) => {
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

    const trip = await Trip.create(req.body);
    
    // Check if request is from a form submission (HTML form)
    // Form submissions have Content-Type: application/x-www-form-urlencoded
    const isFormSubmission = req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data');
    
    // If it's a form submission, redirect to the trips list
    if (isFormSubmission) {
      return res.redirect('/trips?success=Trip created successfully!');
    }
    
    // Default: Return JSON for API clients
    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    // If validation error and HTML is accepted, show form with errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      
      // Check if it's a form submission
      const isFormSubmission = req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data');
      if (isFormSubmission) {
        return res.render('trips/create', {
          title: 'Add New Trip',
          trip: req.body,
          errors
        });
      }
    }
    next(error);
  }
};

// READ - Get all trips
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

// READ - Get single trip by ID
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
};

// UPDATE - Update a trip
const updateTrip = async (req, res, next) => {
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
    
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Check if it's a form submission
    const isFormSubmission = req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data');
    if (isFormSubmission) {
      return res.redirect(`/trips/${updatedTrip._id}?success=Trip updated successfully!`);
    }
    
    res.status(200).json({
      success: true,
      data: updatedTrip
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    
    // If validation error and it's a form submission
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      const isFormSubmission = req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data');
      if (isFormSubmission) {
        const trip = await Trip.findById(req.params.id);
        return res.render('trips/edit', {
          title: `Edit ${trip.destination}`,
          trip: req.body,
          errors
        });
      }
    }
    next(error);
  }
};

// DELETE - Delete a trip
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    await trip.deleteOne();
    
    // Check if it's a form submission
    const isFormSubmission = req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data');
    if (isFormSubmission) {
      return res.redirect('/trips?success=Trip deleted successfully!');
    }
    
    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
};

// ============ VIEW CONTROLLERS (HTML Responses) ============

// Render trips list view
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

// Render create form
const renderCreateForm = (req, res) => {
  res.render('trips/create', {
    title: 'Add New Trip',
    trip: {},
    errors: null
  });
};

// Render edit form
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

// Render trip detail view
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
};
