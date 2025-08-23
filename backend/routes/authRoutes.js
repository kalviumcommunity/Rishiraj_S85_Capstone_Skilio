const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bio = "" } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to verify Google OAuth strategy
router.get('/google/test', (req, res) => {
  console.log('--- GOOGLE OAUTH TEST ENDPOINT ---');
  console.log('Available passport strategies:', Object.keys(passport._strategies));
  console.log('Google strategy exists:', !!passport._strategies.google);
  console.log('Environment variables:');
  console.log('- GOOGLE_CLIENT_ID:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('- GOOGLE_CLIENT_SECRET:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('- GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
  console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('--------------------------------');
  
  res.json({
    strategies: Object.keys(passport._strategies),
    googleStrategyExists: !!passport._strategies.google,
    envVars: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      FRONTEND_URL: process.env.FRONTEND_URL
    }
  });
});

// Google OAuth Routes

// 1. Start the Google authentication process
router.get('/google', (req, res, next) => {
  console.log('--- GOOGLE OAUTH INITIATED ---');
  console.log('Request URL:', req.url);
  console.log('Passport strategies:', Object.keys(passport._strategies));
  console.log('--------------------------------');
  
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

// 2. Google callback route
router.get('/google/callback', (req, res, next) => {
  console.log('--- GOOGLE OAUTH CALLBACK REACHED ---');
  console.log('Callback URL:', req.url);
  console.log('Query params:', req.query);
  console.log('Headers:', req.headers);
  console.log('--------------------------------');
  
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }, (err, user, info) => {
    console.log('--- PASSPORT AUTHENTICATE CALLBACK ---');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);
    console.log('--------------------------------');
    
    if (err) {
      console.error('Error from passport authenticate:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${encodeURIComponent(err.message || 'Authentication failed')}`);
    }
    if (!user) {
      console.error('No user found from Google strategy');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user&message=${encodeURIComponent('No user found from Google authentication')}`);
    }

    // If we get here, the user was found or created successfully by the strategy
    try {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('JWT token generated successfully for user:', user._id);
      const redirectUrl = `${process.env.FRONTEND_URL}/callback?token=${token}`;
      console.log('Redirecting to:', redirectUrl);
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 50) + '...');
      
      // Use standard redirect method which works better with OAuth
      console.log('About to redirect with res.redirect()');
      res.redirect(redirectUrl);

    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=jwt_failed&message=${encodeURIComponent('Token generation failed')}`);
    }
  })(req, res, next);
});

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user route
router.get('/me', auth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio
    }
  });
});

module.exports = router;