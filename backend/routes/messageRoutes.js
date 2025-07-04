// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const auth = require('../middleware/authMiddleware');

// (Optional) Public routes here

// Protect all routes below this line
router.use(auth);

// All protected routes below

// GET - Get all messages (with optional filtering)
router.get('/messages', async (req, res) => {
  try {
    const filter = {};
    
    // Filter by sender
    if (req.query.sender) {
      filter.sender = req.query.sender;
    }
    
    // Filter by recipient
    if (req.query.recipient) {
      filter.recipient = req.query.recipient;
    }
    
    // Filter by exchange
    if (req.query.exchangeId) {
      filter.exchangeId = req.query.exchangeId;
    }
    
    // Filter by read status
    if (req.query.read !== undefined) {
      filter.read = req.query.read === 'true';
    }
    
    const messages = await Message.find(filter)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage')
      .sort({ createdAt: -1 });
      
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get conversation between two users
router.get('/messages/conversation', async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: 'Both user IDs are required' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    })
    .populate('sender', 'name email profileImage')
    .populate('recipient', 'name email profileImage')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get specific message by ID
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage');
      
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new message
router.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage');
      
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a message (typically to mark as read)
router.put('/messages/:id', async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('sender', 'name email profileImage')
    .populate('recipient', 'name email profileImage');
    
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;