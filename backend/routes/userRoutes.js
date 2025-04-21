const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST - Create a new user
router.post('/users', async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = new User(req.body);
    const savedUser = await user.save();
    
    // Don't return the password in the response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a user
router.put('/users/:id', async (req, res) => {
  try {
    // Check if trying to update email to one that already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id } // Exclude current user from check
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('skillsOffered')
      .populate('skillsWanted');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users by skill offered
router.get('/users/skills-offered/:skillId', async (req, res) => {
  try {
    const users = await User.find({ skillsOffered: req.params.skillId })
      .select('-password')
      .populate('skillsOffered');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users by skill wanted
router.get('/users/skills-wanted/:skillId', async (req, res) => {
  try {
    const users = await User.find({ skillsWanted: req.params.skillId })
      .select('-password')
      .populate('skillsWanted');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;