const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
      maxlength: [100, 'Destination cannot exceed 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    photos: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 3,
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
      default: 0,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.virtual('duration').get(function () {
  if (this.startDate && this.endDate) {
    const diff = this.endDate - this.startDate;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return 0;
});

tripSchema.virtual('formattedStartDate').get(function () {
  return this.startDate
    ? this.startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
});

tripSchema.virtual('formattedEndDate').get(function () {
  return this.endDate
    ? this.endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
});

tripSchema.set('toJSON', { virtuals: true });
tripSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);
