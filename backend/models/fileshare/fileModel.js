const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for files
const fileSchema = new mongoose.Schema({
  file_id: {
    type: String,
    default: uuidv4,  // Auto-generate UUID for each file
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User who uploaded the file
  },
  file_name: {
    type: String,
    required: true, // File name is required
    trim: true,
    minlength: 3,  // Minimum length of 3 characters for file name
  },
  file_type: {
    type: String,
    required: true,
    enum: ['image', 'document', 'video', 'audio', 'other'], // Allowed file types
  },
  file_url: {
    type: String,
    required: true,
    match: /^(https?:\/\/)?[\w.-]+(?:\.[a-zA-Z]{2,6})+(?:\/[\w.-]*)*\/?$/, // Basic URL validation
  },
  size: {
    type: Number,
    required: true, // File size in bytes
    min: 1, // Minimum size should be 1 byte
  },
  upload_date: {
    type: Date,
    default: Date.now, // Date of upload
  },
  privacy_level: {
    type: String,
    required: true,
    enum: ['public', 'private', 'restricted'], // Privacy levels
    default: 'private',
  },
});

// Mongoose model for File
const File = mongoose.model('File', fileSchema);

module.exports = { File };
