const { Notification } = require('../models/notificationModel');
const { User } = require('../models/User');
const { paginate } = require('../utils/paginationUtil');  // Import pagination utility
const { logAuditAction } = require('../utils/logAuditAction');

// Create a notification
const createNotification = async (req, res) => {
  try {
    const { user_id, notification_type, notification_content } = req.body;

    // Validate the user (ensure the user exists)
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the new notification
    const newNotification = new Notification({
      user_id,
      notification_type,
      notification_content,
    });

    await newNotification.save();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'create',
      `Created a Notification: ${newNotification._id}`,
      { notification_id: newNotification._id}
    );

    return res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all notifications for a user with pagination
const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the paginate utility
    const { data: notifications, pagination } = await paginate(Notification, { user_id }, page, limit);

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    return res.status(200).json({ notifications, pagination });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get unread notifications for a user with pagination
const getUnreadNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the paginate utility for unread notifications
    const { data: notifications, pagination } = await paginate(Notification, { user_id, is_read: false }, page, limit);

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No unread notifications found' });
    }

    return res.status(200).json({ notifications, pagination });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { user_id, notification_id } = req.params;

    // Find the notification by ID
    const notification = await Notification.findOne({ notification_id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update the notification status to read
    notification.is_read = true;
    await notification.save();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a Notification: ${notification._id}`,
      { notification_id: notification._id}
    );

    return res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update all unread notifications for the user
    const result = await Notification.updateMany(
      { user_id, is_read: false },
      { $set: { is_read: true } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No unread notifications found for this user' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated all Notifications: ${result._id}`,
      { notification_id: result._id}
    );
    

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { user_id,notification_id } = req.params;

    // Find the notification by ID
    const notification = await Notification.findOne({ notification_id });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Delete the notification
    await notification.remove();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a Notification: ${notification._id}`,
      { notification_id: notification._id}
    );
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
