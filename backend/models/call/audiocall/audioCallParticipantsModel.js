const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for audio call participants
const audioCallParticipantSchema = new mongoose.Schema({
  call_id: {
    type: String,
    ref: 'AudioCall', // Reference to the AudioCall
    required: [true, 'Call ID is required'],  // Ensure call_id is required
    validate: {
      validator: async function(v) {
        const callExists = await mongoose.models.AudioCall.exists({ call_id: v });
        return callExists;  // Check if the AudioCall exists
      },
      message: 'Audio Call with the specified call_id does not exist',
    },
  },
  user_id: {
    type: String,
    ref: 'User', // Reference to the User who participated in the audio call
    required: [true, 'User ID is required'], // Ensure user_id is required
    validate: {
      validator: async function(v) {
        const userExists = await mongoose.models.User.exists({ user_id: v });
        return userExists; // Check if the User exists
      },
      message: 'User with the specified user_id does not exist',
    },
  },
  joined_at: {
    type: Date,
    default: Date.now, // Default value for when the user joins the call
    required: [true, 'Join date is required'],  // Ensure joined_at is required
    validate: {
      validator: function(v) {
        return v instanceof Date;  // Validate that the date is valid
      },
      message: 'Invalid join date format',
    },
  },
  left_at: {
    type: Date,
    default: null, // Nullable field for when the user leaves the call
    validate: {
      validator: function(v) {
        // Validate if left_at is null or a valid Date object
        return v === null || v instanceof Date;
      },
      message: 'Invalid left date format',
    },
  },
});

// Mongoose model for AudioCallParticipant
const AudioCallParticipant = mongoose.model('AudioCallParticipant', audioCallParticipantSchema);

module.exports = { AudioCallParticipant };
