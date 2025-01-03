const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for audio calls
const audioCallSchema = new mongoose.Schema({
  call_id: {
    type: String,
    default: uuidv4,  // Auto-generate UUID for each audio call
    unique: true,  // Ensure unique call_id for every call
  },
  host_id: {
    type: String,
    required: [true, 'Host ID is required'],
    ref: 'User', // Reference to the User who hosted the audio call
    validate: {
      validator: async function(v) {
        const userExists = await mongoose.models.User.exists({ user_id: v });
        return userExists;  // Check if the user exists
      },
      message: 'Host with the specified user_id does not exist',
    },
  },
  call_type: {
    type: String,
    enum: ['one-on-one', 'group'], // Type of the call (one-on-one or group)
    required: [true, 'Call type is required'],
  },
  start_time: {
    type: Date,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(v) {
        return v instanceof Date; // Ensure valid Date object
      },
      message: 'Invalid start time format',
    },
  },
  end_time: {
    type: Date,
    default: null, // Nullable, will be set when the call ends
    validate: {
      validator: function(v) {
        // If end_time is provided, it should be after start_time
        if (v && this.start_time && v < this.start_time) {
          return false; // end_time cannot be before start_time
        }
        return true;
      },
      message: 'End time must be after start time',
    },
  },
  duration: {
    type: Number,
    default: null, // Duration in seconds (nullable initially)
    validate: {
      validator: function(v) {
        // Duration is required only when the call is completed
        if (this.status === 'completed' && (v === null || v <= 0)) {
          return false; // Duration must be greater than 0 when status is 'completed'
        }
        return true;
      },
      message: 'Duration must be greater than 0 when the call is completed',
    },
  },
  room_id: {
    type: String,
    unique: true,  // Ensure the room_id is unique // its a url meeting_room_link
    required: [true, 'Room ID is required'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Invalid room ID format'], // Ensure room ID is alphanumeric with hyphens or underscores
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  created_at: {
    type: Date,
    default: Date.now, // When the call was created
  },
});

// Mongoose model for AudioCall
const AudioCall = mongoose.model('AudioCall', audioCallSchema);

module.exports = { AudioCall };
