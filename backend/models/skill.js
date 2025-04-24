const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: String,
  description: String,
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  location: String,
  media_url: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // reference
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
