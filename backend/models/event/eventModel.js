const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  event_type: {
    type: String,
    enum: ['meeting', 'task', 'reminder', 'calendar', 'other'],
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User', // User who created the event
    required: true,
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group', // Group involved in the event (e.g., a team or department)
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Participant', // Links to the Participant model
    }
  ],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
