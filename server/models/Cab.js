// models/Cab.js
const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pricePerMinute: {
    type: Number,
    required: true
  },

});

const Cab = mongoose.model('Cab', cabSchema);

module.exports = Cab;
