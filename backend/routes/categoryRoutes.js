const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// GET - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const filter = {};
    
    // Filter active/inactive categories
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    // Filter by parent category
    if (req.query.parentCategory) {
      filter.parentCategory = req.query.parentCategory === 'null' ? null : req.query.parentCategory;
    }
    
    const categories = await Category.find(filter)
      .populate('parentCategory')
      .sort({ name: 1 });
      
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get root categories (with no parent)
router.get('/categories/root', async (req, res) => {
  try {
    const rootCategories = await Category.find({ parentCategory: null })
      .sort({ name: 1 });
      
    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get specific category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory');
      
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get subcategories of a specific category
router.get('/categories/:id/subcategories', async (req, res) => {
  try {
    const subcategories = await Category.find({ parentCategory: req.params.id })
      .sort({ name: 1 });
      
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new category
router.post('/categories', async (req, res) => {
  try {
    // Check if category name already exists
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = new Category(req.body);
    const savedCategory = await category.save();
    
    const populatedCategory = await Category.findById(savedCategory._id)
      .populate('parentCategory');
    
    res.status(201).json(populatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a category
router.put('/categories/:id', async (req, res) => {
  try {
    // Check if updating to an existing category name
    if (req.body.name) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parentCategory');
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;