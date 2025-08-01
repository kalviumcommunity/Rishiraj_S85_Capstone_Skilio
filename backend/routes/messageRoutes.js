const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const auth = require('../middleware/authMiddleware');

// Protect all routes below this line
router.use(auth);

// GET - Get conversation between two users (put this BEFORE the general messages route)
router.get('/conversation', async (req, res) => {
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
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all messages for current user (with optional filtering)
router.get('/', async (req, res) => {
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
    
    // Only show messages where current user is sender or recipient
    filter.$or = [
      { sender: req.user.userId },
      { recipient: req.user.userId }
    ];
    
    const messages = await Message.find(filter)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Get specific message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage');
      
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if current user is sender or recipient
    if (message.sender._id.toString() !== req.user.userId.toString() && 
        message.recipient._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }
    
    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new message
router.post('/', async (req, res) => {
  try {
    const { recipient, content, exchangeId } = req.body;
    
    if (!recipient || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }
    
    const message = new Message({
      sender: req.user.userId,
      recipient,
      content,
      exchangeId
    });
    
    const savedMessage = await message.save();
    
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name email profileImage')
      .populate('recipient', 'name email profileImage');
      
    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update a message (typically to mark as read)
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if current user is the recipient (only recipients can mark as read)
    if (message.recipient.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this message' });
    }
    
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('sender', 'name email profileImage')
    .populate('recipient', 'name email profileImage');
    
    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if current user is the sender (only senders can delete)
    if (message.sender.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT - Mark multiple messages as read
router.put('/mark-read/bulk', async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: 'Message IDs array is required' });
    }
    
    const result = await Message.updateMany(
      { 
        _id: { $in: messageIds },
        recipient: req.user.userId 
      },
      { read: true }
    );
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} messages marked as read`
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;