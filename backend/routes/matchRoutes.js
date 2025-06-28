const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const auth = require('../middleware/authMiddleware');

// (Optional) Public routes here

// Protect all routes below this line
router.use(auth);

// GET - Get all matches (with optional filtering)
router.get('/matches', async (req, res) => {
  try {
    const filter = {};
    
    // Filter by user ID
    if (req.query.userId) {
      filter.users = req.query.userId;
    }
    
    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by minimum match score
    if (req.query.minScore) {
      filter.matchScore = { $gte: parseInt(req.query.minScore) };
    }
    
    const matches = await Match.find(filter)
      .populate('users', 'name email profileImage')
      .populate('skillOffered.user', 'name email')
      .populate('skillOffered.skill', 'title category level')
      .populate('skillWanted.user', 'name email')
      .populate('skillWanted.skill', 'title category level')
      .populate('initiatedBy', 'name email')
      .sort({ matchScore: -1, createdAt: -1 });
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get match by ID
router.get('/matches/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('users', 'name email profileImage')
      .populate('skillOffered.user', 'name email')
      .populate('skillOffered.skill', 'title category level')
      .populate('skillWanted.user', 'name email')
      .populate('skillWanted.skill', 'title category level')
      .populate('initiatedBy', 'name email');
      
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all matches for a specific user
router.get('/matches/user/:userId', async (req, res) => {
  try {
    const matches = await Match.find({ users: req.params.userId })
      .populate('users', 'name email profileImage')
      .populate('skillOffered.user', 'name email')
      .populate('skillOffered.skill', 'title category level')
      .populate('skillWanted.user', 'name email')
      .populate('skillWanted.skill', 'title category level')
      .populate('initiatedBy', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new match
router.post('/matches', async (req, res) => {
  try {
    // Check if match already exists between these users for these skills
    const existingMatch = await Match.findOne({
      $and: [
        { users: { $all: req.body.users } },
        { 'skillOffered.skill': req.body.skillOffered.skill },
        { 'skillWanted.skill': req.body.skillWanted.skill }
      ]
    });
    
    if (existingMatch) {
      return res.status(400).json({ 
        message: 'A match already exists between these users for these skills',
        existingMatch
      });
    }
    
    const match = new Match(req.body);
    const savedMatch = await match.save();
    
    const populatedMatch = await Match.findById(savedMatch._id)
      .populate('users', 'name email profileImage')
      .populate('skillOffered.user', 'name email')
      .populate('skillOffered.skill', 'title category level')
      .populate('skillWanted.user', 'name email')
      .populate('skillWanted.skill', 'title category level')
      .populate('initiatedBy', 'name email');
      
    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a match
router.put('/matches/:id', async (req, res) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('users', 'name email profileImage')
    .populate('skillOffered.user', 'name email')
    .populate('skillOffered.skill', 'title category level')
    .populate('skillWanted.user', 'name email')
    .populate('skillWanted.skill', 'title category level')
    .populate('initiatedBy', 'name email');
    
    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(updatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;