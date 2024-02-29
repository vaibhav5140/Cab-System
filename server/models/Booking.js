// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  cabId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cab',
    required: true
  },
  travelTime: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
