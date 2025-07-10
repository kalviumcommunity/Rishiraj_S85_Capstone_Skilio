const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function() { return !this.googleId; }, // Only required if not Google OAuth
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: String,
    location: String,
    profileImage: String,
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    interests: [String],
    skillsOffered: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    ],
    skillsWanted: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    ],
    premium: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: String,
    subscriptionId: String,
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive'
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        chat: { type: Boolean, default: true }
      },
      privacy: {
        profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
        showLocation: { type: Boolean, default: true },
        showRating: { type: Boolean, default: true }
      }
    }
  },
  { timestamps: true }
);

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ location: 1 });
userSchema.index({ rating: -1 });

module.exports = mongoose.model("User", userSchema);
