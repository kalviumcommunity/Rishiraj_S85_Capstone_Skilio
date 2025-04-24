const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // reference
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // reference
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  exchangeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exchange'   // reference
  },
  attachments: [{
    type: String 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);