const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  skillOffered: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }
  },
  skillWanted: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    }
  },
  matchScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);