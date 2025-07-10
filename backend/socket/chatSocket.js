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

        // Send to recipient
        io.to(recipientId).emit('receive_message', populatedMessage);
        
        // Send back to sender for confirmation
        socket.emit('message_sent', populatedMessage);
        
      } catch (error) {
        socket.emit('message_error', { error: error.message });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(data.recipientId).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.recipientId).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    // Handle read receipts
    socket.on('mark_read', async (data) => {
      try {
        await Message.updateMany(
          { 
            sender: data.senderId, 
            recipient: socket.user._id,
            read: false 
          },
          { read: true }
        );
        
        io.to(data.senderId).emit('messages_read', {
          readerId: socket.user._id
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
}

module.exports = initializeSocket; 