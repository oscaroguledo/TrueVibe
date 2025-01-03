const express = require('express');
const router = express.Router();

const {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require('../controller/notificationController');

// Create a new notification
router.post('/create', createNotification);

// Get all notifications for a specific user with pagination
router.get('/:user_id/notifications', getNotifications);

// Get unread notifications for a specific user with pagination
router.get('/:user_id/notifications/unread', getUnreadNotifications);

// Mark a specific notification as read
router.put('/:notification_id/read', markNotificationAsRead);

// Mark all unread notifications as read for a specific user
router.put('/:user_id/notifications/mark-all-read', markAllNotificationsAsRead);

// Delete a specific notification
router.delete('/:notification_id', deleteNotification);

module.exports = router;
