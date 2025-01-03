const mongoose = require('mongoose');
const { Schema } = mongoose;
const Event = require('./eventModel'); // Base Event Model

const calendarEventSchema = new Schema({
  recurrence_rule: {
    type: String, // iCal Recurrence rule format
    default: null,
  },
  reminder_time: {
    type: Number, // Number of minutes before the event to send a reminder
    default: 15,
  },
  reminder_sent: {
    type: Boolean,
    default: false,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  is_recurring: {
    type: Boolean,
    default: false,
  },
});

// Inherit from the Event model
calendarEventSchema.add(Event.schema);

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

module.exports = CalendarEvent;
