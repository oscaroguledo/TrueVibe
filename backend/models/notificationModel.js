const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for notifications
const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: String,
    default: uuidv4, // Auto-generate UUID for each notification
    unique: true,
  },
  user_id: {
    type: String,
    ref: 'User', // Reference to the User who will receive the notification
    required: true,
  },
  notification_type: {
    type: String,
    enum: ['message', 'task', 'meeting', 'reminder', 'alert', 'other'], // Different types of notifications
    required: true,
  },
  notification_content: {
    type: String,
    required: true, // Content describing the notification (message, task update, etc.)
  },
  is_read: {
    type: Boolean,
    default: false, // Initially set to false (notification unread)
  },
  created_at: {
    type: Date,
    default: Date.now, // The timestamp when the notification was created
  },
});

// Mongoose model for Notification
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification };
