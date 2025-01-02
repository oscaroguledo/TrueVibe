const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Mongoose schema for video call participants
const videoCallParticipantSchema = new mongoose.Schema({
  call_id: {
    type: String,
    required: true,
    ref: 'VideoCall', // Reference to the VideoCall model
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User who participated in the call
  },
  joined_at: {
    type: Date,
    required: true,
    default: Date.now,  // Timestamp when the user joined the call
  },
  left_at: {
    type: Date,
    default: null,  // Nullable: timestamp when the user left the call
  },
});

// Mongoose model for VideoCallParticipant
const VideoCallParticipant = mongoose.model('VideoCallParticipant', videoCallParticipantSchema);

// Joi validation for creating a video call participant
const validateVideoCallParticipant = (participant) => {
  const schema = Joi.object({
    call_id: Joi.string()
      .required()
      .messages({
        'any.required': 'Call ID is required.',
      }),

    user_id: Joi.string()
      .required()
      .messages({
        'any.required': 'User ID is required.',
      }),

    joined_at: Joi.date()
      .required()
      .messages({
        'any.required': 'Join timestamp is required.',
        'date.base': 'Join timestamp must be a valid date.',
      }),

    left_at: Joi.date().optional(),
  });

  return schema.validate(participant);
};

module.exports = { VideoCallParticipant, validateVideoCallParticipant };
