const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  github: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  link: [],
  owner: {
    type: Object,
    required: true
  },
  teamMembers: [
    {
      email: {
        type: String
      },
      name: {
        type: String
      }
    }
  ],
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },

  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
