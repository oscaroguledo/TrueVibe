const mongoose = require('mongoose');
const Joi = require('joi');

// Channel Members Schema definition
const channelMemberSchema = new mongoose.Schema({
  channel_id: {
    type: String,
    required: true,
    ref: 'Channel' // FK to Channels collection (channel_id)
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User' // FK to Users collection (user_id)
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin', 'member'], // Users can be either admins or regular members
    default: 'member'
  }
});

// Mongoose model for the channel members
const ChannelMember = mongoose.model('ChannelMember', channelMemberSchema);


// Joi validation schema for adding a channel member
const validateChannelMember = (member) => {
  const schema = Joi.object({
    channel_id: Joi.string().required().messages({
      'any.required': 'Channel ID is required.'
    }),
    user_id: Joi.string().required().messages({
      'any.required': 'User ID is required.'
    }),
    role: Joi.string().valid('admin', 'member').default('member'),
  });

  return schema.validate(member);
};

module.exports = { ChannelMember,validateChannelMember };

module.exports = ChannelMember;
