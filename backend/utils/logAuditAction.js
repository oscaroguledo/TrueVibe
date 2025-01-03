// logAuditAction.js
const { queue } = require('./backgroundJobQueue');

// Function to add an audit log job to the queue
const logAuditAction = async (user_id, action_type, action_description, affected_object) => {
  try {
    await queue.add({
      user_id,
      action_type,
      action_description,
      affected_object,
    });
    console.log('Audit log job added to queue');
  } catch (err) {
    console.error('Error adding audit log job to queue:', err);
  }
};

module.exports = { logAuditAction };
