const mongoose = require('mongoose');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for video calls
const videoCallSchema = new mongoose.Schema({
  call_id: {
    type: String,
    default: uuidv4,  // Auto-generate UUID for each call
    unique: true,
  },
  host_id: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User who is the host of the call
  },
  call_type: {
    type: String,
    enum: ['one-on-one', 'group'], // Call type: either one-on-one or group call
    required: true,
  },
  start_time: {
    type: Date,
    required: true,  // Timestamp when the call starts
  },
  end_time: {
    type: Date,
    default: null,  // Nullable: timestamp when the call ends, will be null for active calls
  },
  duration: {
    type: Number,
    default: 0,  // Duration in seconds
  },
  room_id: {
    type: String,
    unique: true,  // Unique room URL for each call
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],  // Call status
    default: 'scheduled', // Default status is scheduled
  },
  created_at: {
    type: Date,
    default: Date.now,  // Timestamp when the call record was created
  },
});

// Mongoose model for VideoCall
const VideoCall = mongoose.model('VideoCall', videoCallSchema);

// Joi validation for creating a video call
const validateVideoCall = (videoCall) => {
  const schema = Joi.object({
    host_id: Joi.string()
      .required()
      .messages({
        'any.required': 'Host is required.',
      }),

    call_type: Joi.string()
      .valid('one-on-one', 'group')
      .required()
      .messages({
        'any.required': 'Call type is required.',
        'any.only': 'Call type must be either "one-on-one" or "group".',
      }),

    start_time: Joi.date()
      .required()
      .messages({
        'any.required': 'Start time is required.',
        'date.base': 'Start time must be a valid date.',
      }),

    end_time: Joi.date().optional(),

    room_id: Joi.string()
      .required()
      .messages({
        'any.required': 'Room ID is required.',
      }),

    status: Joi.string()
      .valid('scheduled', 'active', 'completed', 'cancelled')
      .default('scheduled')
      .messages({
        'any.only': 'Status must be one of "scheduled", "active", "completed", or "cancelled".',
      }),
  });

  return schema.validate(videoCall);
};

module.exports = { VideoCall, validateVideoCall };
