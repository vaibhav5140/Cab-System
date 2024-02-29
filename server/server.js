// server.js
const express = require('express');
const mongoose = require('mongoose');
const cabRoutes = require('./routes/cabRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
require("dotenv").config();
const cors=require('cors');
const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('connected', () => {
    console.log('MongoDB connection successful!');
});

// Routes
app.use('/api', cabRoutes);
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  