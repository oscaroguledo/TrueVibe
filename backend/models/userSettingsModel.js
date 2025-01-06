const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Settings Schema
const userSettingsSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    setting_name: {
      type: String,
      required: true,
      enum: ['language', 'notifications', 'privacy', 'theme', 'timezone'], // Example settings
    },
    setting_value: {
      type: Schema.Types.Mixed, // Mixed type to handle string, boolean, or JSON
      required: true,
    }
  },
  {
    timestamps: true, // Automatically adds `created_at` and `updated_at`
  }
);

// Model
const UserSetting = mongoose.model('UserSetting', userSettingsSchema);

module.exports = { UserSetting };
