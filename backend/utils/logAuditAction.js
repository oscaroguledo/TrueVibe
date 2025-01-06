// logAuditAction.js

const { AuditLog } = require('../models/auditLogModel');

// Log audit action directly and save to the database
const logAuditAction = async (user_id, action_type, action_description, affected_object) => {
  try {
    // Create a new audit log
    const newAuditLog = new AuditLog({
      user_id,
      action_type,
      action_description,
      affected_object,
    });

    // Save the new audit log to the database
    await newAuditLog.save();
    console.log('Audit log saved successfully');
  } catch (err) {
    console.error('Error saving audit log:', err);
  }
};

module.exports = { logAuditAction };

