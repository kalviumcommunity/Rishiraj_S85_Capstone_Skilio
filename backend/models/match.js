const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // reference
    required: true
  }],
  skillOffered: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  // reference
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'   // reference
    }
  },
  skillWanted: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  // reference
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'  // reference
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
    ref: 'User'  // reference
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);