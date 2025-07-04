const express = require('express');
const Skill = require('../models/skill');
<<<<<<< HEAD
const User = require('../models/user');
const { auth } = require('./authRoutes');
const router = express.Router();
=======
const auth = require('../middleware/authMiddleware');

// (Optional) Public routes here

// Protect all routes below this line
router.use(auth);
>>>>>>> 543cf142b4157f9347685087f2e47f9559f7fc60

// Get all skills with filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      location,
      skillType,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Level filter
    if (level) {
      query.level = level;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Skill type filter (offering/seeking)
    if (skillType && skillType !== 'all') {
      query.isOffering = skillType === 'offering';
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'reviews':
        sort.reviewCount = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const skills = await Skill.find(query)
      .populate('createdBy', 'name profileImage rating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Skill.countDocuments(query);

    res.json({
      success: true,
      skills,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single skill
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('createdBy', 'name profileImage bio rating reviewCount');

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new skill
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      location,
      tags,
      mediaUrls,
      isOffering,
      availability,
      requirements
    } = req.body;

    const skill = new Skill({
      title,
      description,
      category,
      level,
      location,
      tags: tags || [],
      mediaUrls: mediaUrls || [],
      isOffering,
      availability,
      requirements,
      createdBy: req.user._id
    });

    await skill.save();

    // Update user's skills array
    if (isOffering) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { skillsOffered: skill._id }
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { skillsWanted: skill._id }
      });
    }

    const populatedSkill = await Skill.findById(skill._id)
      .populate('createdBy', 'name profileImage');

    res.status(201).json({ success: true, skill: populatedSkill });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check ownership
    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name profileImage');

    res.json({ success: true, skill: updatedSkill });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    // Check ownership
    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove from user's skills array
    if (skill.isOffering) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { skillsOffered: skill._id }
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { skillsWanted: skill._id }
      });
    }

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's skills
router.get('/user/:userId', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    let query = { createdBy: req.params.userId };

    if (type === 'offering') {
      query.isOffering = true;
    } else if (type === 'seeking') {
      query.isOffering = false;
    }

    const skills = await Skill.find(query)
      .populate('createdBy', 'name profileImage');

    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get skill suggestions (AI-powered)
router.get('/suggestions/:userId', auth, async (req, res) => {
  try {
    // This would integrate with OpenAI API for personalized suggestions
    // For now, return skills from similar users
    const user = await User.findById(req.params.userId);
    
    const suggestions = await Skill.find({
      createdBy: { $ne: req.params.userId },
      category: { $in: user.interests || [] }
    })
    .populate('createdBy', 'name profileImage rating')
    .limit(6);

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;