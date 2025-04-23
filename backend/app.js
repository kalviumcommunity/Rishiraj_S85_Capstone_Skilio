const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const skillRoutes = require('./routes/skillRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-exchange')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', skillRoutes);
app.use('/api', userRoutes);
app.use('/api', messageRoutes);
app.use('/api', categoryRoutes);
app.use('/api', matchRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to Skilio - A Skill Barter Platform API');
});

module.exports = app;