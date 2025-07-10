const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  location: String,
  tags: [String],
  mediaUrls: [{
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    }
  }],
  isOffering: {
    type: Boolean,
    required: true
  },
  availability: {
    type: String,
    enum: ['flexible', 'weekdays', 'weekends', 'evenings'],
    default: 'flexible'
  },
  requirements: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  aiScore: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for better performance
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });
skillSchema.index({ category: 1 });
skillSchema.index({ level: 1 });
skillSchema.index({ location: 1 });
skillSchema.index({ isOffering: 1 });
skillSchema.index({ createdBy: 1 });
skillSchema.index({ rating: -1 });
skillSchema.index({ createdAt: -1 });
skillSchema.index({ featured: 1, premium: 1 });

module.exports = mongoose.model('Skill', skillSchema);
