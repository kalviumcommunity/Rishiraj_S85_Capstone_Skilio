const express = require('express');
const Skill = require('../models/skill');
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Public route for fetching skills (no authentication required)
router.get('/public', async (req, res) => {
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
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public route for fetching individual skill (no authentication required)
router.get('/public/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('createdBy', 'name profileImage bio rating reviewCount');

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ success: true, skill });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protect all routes below this line
router.use(auth);

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
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get skill suggestions (AI-powered) - moved before /:id to avoid conflicts
router.get('/suggestions/:userId', async (req, res) => {
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
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's skills - moved before /:id to avoid conflicts
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
    console.error('Error fetching user skills:', error);
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
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new skill - removed duplicate auth middleware
router.post('/', async (req, res) => {
  try {
    console.log('Creating skill with user:', req.user); // Debug log
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

    // Format mediaUrls to match schema
    const formattedMediaUrls = (mediaUrls || []).map(url => {
      if (typeof url === 'string') {
        return { url, type: 'image' };
      }
      return url;
    });

    const skill = new Skill({
      title,
      description,
      category,
      level,
      location,
      tags: tags || [],
      mediaUrls: formattedMediaUrls,
      isOffering,
      availability,
      requirements,
      createdBy: req.user.userId
    });

    await skill.save();

    // Update user's skills array
    if (isOffering) {
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { skillsOffered: skill._id }
      });
    } else {
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { skillsWanted: skill._id }
      });
    }

    const populatedSkill = await Skill.findById(skill._id)
      .populate('createdBy', 'name profileImage');

    res.status(201).json({ success: true, skill: populatedSkill });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
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
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
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
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;