// controllers/cabController.js
const Cab = require('../models/Cab');

// Controller functions for managing cabs
exports.getAllCabs = async (req, res) => {
  try {
    const cabs = await Cab.find();
    res.json(cabs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCab = async (req, res) => {
  try {
    // Check if there are already 5 cabs
    // const totalCabs = await Cab.countDocuments();
    // if (totalCabs >= 5) {
    //   return res.status(400).json({ message: 'Maximum limit for cabs reached' });
    // }
    

    
    const cab = new Cab({
      name: req.body.name,
      pricePerMinute: req.body.pricePerMinute,
    
    });

    const newCab = await cab.save();
    res.status(201).json(newCab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateCab = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (cab == null) {
      return res.status(404).json({ message: 'Cab not found' });
    }
    cab.name = req.body.name;
    cab.pricePerMinute = req.body.pricePerMinute;
  
    const updatedCab = await cab.save();
    res.json(updatedCab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCab = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (cab == null) {
      return res.status(404).json({ message: 'Cab not found' });
    }
    await cab.deleteOne();
    res.json({ message: 'Cab deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
