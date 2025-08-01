const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/message');
const User = require('../models/user');

function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Handle private messages
    socket.on('send_message', async (data) => {
      try {
        const { recipientId, content, exchangeId } = data;
        
        console.log(`Message from ${socket.user.name} to ${recipientId}: ${content}`);
        
        // Validate recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
          socket.emit('message_error', { error: 'Recipient not found' });
          return;
        }
        
        const message = new Message({
          sender: socket.user._id,
          recipient: recipientId,
          content,
          exchangeId
        });

        const savedMessage = await message.save();
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'name profileImage')
          .populate('recipient', 'name profileImage');

        console.log('Message saved and populated:', populatedMessage);

        // Send to recipient's room
        io.to(recipientId).emit('receive_message', populatedMessage);
        
        // Send back to sender for confirmation (same event name for consistency)
        socket.emit('message_sent', populatedMessage);
        
        console.log(`Message delivered to recipient ${recipientId} and confirmed to sender ${socket.user._id}`);
        
      } catch (error) {
        console.error('Error handling send_message:', error);
        socket.emit('message_error', { error: error.message });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      console.log(`${socket.user.name} started typing to ${data.recipientId}`);
      socket.to(data.recipientId).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('typing_stop', (data) => {
      console.log(`${socket.user.name} stopped typing to ${data.recipientId}`);
      socket.to(data.recipientId).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    // Handle read receipts
    socket.on('mark_read', async (data) => {
      try {
        const updatedMessages = await Message.updateMany(
          { 
            sender: data.senderId, 
            recipient: socket.user._id,
            read: false 
          },
          { read: true }
        );
        
        console.log(`Marked ${updatedMessages.modifiedCount} messages as read`);
        
        io.to(data.senderId).emit('messages_read', {
          readerId: socket.user._id
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle user joining a conversation room (optional for group chats later)
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`${socket.user.name} joined conversation ${conversationId}`);
    });

    // Handle user leaving a conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`${socket.user.name} left conversation ${conversationId}`);
    });

    // Handle user going online/offline
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status_change', {
        userId: socket.user._id,
        status: 'online'
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status_change', {
        userId: socket.user._id,
        status: 'offline'
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.name}:`, error);
    });
  });

  return io;
}

module.exports = initializeSocket;