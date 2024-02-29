// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define routes for managing bookings
//router.get('/bookings', bookingController.getAllBookings);
//
router.post('/available-cabs', bookingController.getAllAvailableCabs);
router.post('/book-cab/:cabId', bookingController.bookCab);
module.exports = router;
