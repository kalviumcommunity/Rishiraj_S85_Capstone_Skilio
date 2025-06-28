const express = require('express');
const router = express.Router();
const Skill = require('../models/skill');
const auth = require('../middleware/authMiddleware');

// (Optional) Public routes here

// Protect all routes below this line
router.use(auth);

// POST - Create a new skill
router.post('/skills', async (req, res) => {
  try {
    const skill = new Skill(req.body);
    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a skill
router.put('/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().populate('createdBy', 'name email');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single skill by ID
router.get('/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('createdBy', 'name email');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get skills by category
router.get('/skills/category/:category', async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).populate('createdBy', 'name email');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get skills by level
router.get('/skills/level/:level', async (req, res) => {
  try {
    const skills = await Skill.find({ level: req.params.level }).populate('createdBy', 'name email');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;