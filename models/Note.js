let mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Create new Schema
let NoteSchema = new Schema({
  body: {
    type: String,

  },
  articleId: {
    type: String,

  }
});

// Create model for Mongoose
let Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;