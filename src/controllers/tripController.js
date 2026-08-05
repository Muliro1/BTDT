const Trip = require('../models/Trip');
const { AppError } = require('../middleware/errorHandler');

// ============ GET ALL TRIPS ============
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

// ============ GET SINGLE TRIP BY ID ============
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
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return next(new AppError('Trip not found', 404));
    }
    next(error);
  }
};

module.exports = {
  getAllTrips,
  getTripById
};
