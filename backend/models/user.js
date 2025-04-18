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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: String,
    skillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    skillsWanted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
