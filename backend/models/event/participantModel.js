const mongoose = require('mongoose');
const { Schema } = mongoose;

const participantSchema = new Schema({
  event_id: {
    type: Schema.Types.ObjectId,
    ref: 'Event', // Reference to the Event model
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (person attending the event)
    required: true,
  },
  response: {
    type: String,
    enum: ['accepted', 'declined', 'tentative'],
    default: 'tentative', // Default response is tentative
  },
  notified: {
    type: Boolean,
    default: false, // Whether the participant has been notified
  },
  response_time: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
