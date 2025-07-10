const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { upload, uploadSkillImages, uploadProfileImage, deleteImage } = require('../services/cloudinary');

// Upload skill images (max 3)
router.post('/skill-images', auth, upload.array('images', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedImages = await uploadSkillImages(req.files);
    
    res.json({
      success: true,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Upload profile image
router.post('/profile-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const uploadedImage = await uploadProfileImage(req.file);
    
    // Update user's profile image
    const User = require('../models/user');
    await User.findByIdAndUpdate(req.user._id, {
      profileImage: uploadedImage.url
    });

    res.json({
      success: true,
      image: uploadedImage
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Delete image
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const result = await deleteImage(req.params.publicId);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router; 