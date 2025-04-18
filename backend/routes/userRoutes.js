const express = require('express');
const router = express.Router();
const User = require('../models/user');

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