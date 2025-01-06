const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Audit Log Schema
const auditLogSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    action_type: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete'], // Allowed action types
    },
    action_description: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically sets the current timestamp
    },
    affected_object: {
      type: Schema.Types.Mixed, // A flexible field to store the affected object (message, task, file, etc.)
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `created_at` and `updated_at`
  }
);

// Model
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = { AuditLog };
