const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for file shares
const fileShareSchema = new mongoose.Schema({
  file_id: {
    type: String,
    required: true,
    ref: 'File', // Reference to the File being shared
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User who has access to the file
  },
  shared_at: {
    type: Date,
    default: Date.now, // Date the file was shared
  },
});

// Mongoose model for FileShare
const FileShare = mongoose.model('FileShare', fileShareSchema);

module.exports = { FileShare };
