// routes/cabRoutes.js
const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');

// Define routes for managing cabs
router.get('/cabs', cabController.getAllCabs);
router.post('/cabs', cabController.createCab);
router.put('/cabs/:id', cabController.updateCab);
router.delete('/cabs/:id', cabController.deleteCab);

module.exports = router;
