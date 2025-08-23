const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Debug environment variables
console.log('--- PASSPORT CONFIG DEBUG ---');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('--------------------------------');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Initializing Google OAuth strategy...');
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // --- DEBUGGING LOGS ---
        console.log('--- GOOGLE CALLBACK REACHED ---');
        console.log('Profile Info:', profile);
        // ----------------------

        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // --- DEBUGGING LOGS ---
            console.log('User found in DB:', user);
            // ----------------------
            return done(null, user);
          }
          
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0].value,
            googleId: profile.id,
            password: Math.random().toString(36).slice(-8)
          });
          
          await user.save();
          // --- DEBUGGING LOGS ---
          console.log('New user created:', user);
          // ----------------------
          return done(null, user);

        } catch (error) {
          // --- DEBUGGING LOGS ---
          console.error('Error during database operation:', error);
          // ----------------------
          return done(error, null);
        }
      }
    )
  );
  console.log('Google OAuth strategy initialized successfully!');
} else {
  console.log('Google OAuth credentials not found. Google OAuth will be disabled.');
  console.log('Missing:', {
    GOOGLE_CLIENT_ID: !process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !process.env.GOOGLE_CLIENT_SECRET
  });
}

module.exports = passport;