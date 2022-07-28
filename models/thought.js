const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const ThoughtSchema = new Schema({
  username: String,
  thought: String,
  date: {
    type: Date,
    default: Date.now,
  }
});

// Model
const Thought = mongoose.model("Thought", ThoughtSchema);

module.exports = Thought;
