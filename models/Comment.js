const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  project_id: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  profilelink: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Comment = mongoose.model("comments", CommentSchema);
