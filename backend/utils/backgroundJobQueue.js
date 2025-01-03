// backgroundJobQueue.js
const Bull = require('bull');
const { AuditLog } = require('../models/auditLogModel');
const queue = new Bull('audit-log-queue', {
  redis: { host: 'localhost', port: 6379 },
});

queue.process(async (job) => {
  try {
    // Create a new audit log in the background
    const { user_id, action_type, action_description, affected_object } = job.data;

    const newAuditLog = new AuditLog({
      user_id,
      action_type,
      action_description,
      affected_object,
    });

    await newAuditLog.save();
    console.log('Audit log saved successfully');
  } catch (err) {
    console.error('Error saving audit log in background job:', err);
  }
});

module.exports = { queue };
