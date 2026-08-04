const Trip = require('../models/Trip');

// ============ GET ALL TRIPS ============
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ GET SINGLE TRIP BY ID ============
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllTrips,
  getTripById
};
