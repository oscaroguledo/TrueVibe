const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for task comments
const taskCommentSchema = new mongoose.Schema({
  comment_id: {
    type: String,
    default: uuidv4, // Auto-generate UUID for each comment
    unique: true,  // Ensure comment_id is unique
  },
  task_id: {
    type: String,
    required: [true, 'Task ID is required'],
    ref: 'Task', // Reference to the Task being commented on
    validate: {
      validator: async function(v) {
        const taskExists = await mongoose.models.Task.exists({ task_id: v });
        return taskExists;  // Check if the task exists
      },
      message: 'Task with the specified task_id does not exist',
    },
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User', // Reference to the User who made the comment
    validate: {
      validator: async function(v) {
        const userExists = await mongoose.models.User.exists({ user_id: v });
        return userExists;  // Check if the user exists
      },
      message: 'User with the specified user_id does not exist',
    },
  },
  comment_text: {
    type: String,
    required: [true, 'Comment text is required'],
    minlength: [1, 'Comment text must be at least 1 character long'],
    maxlength: [500, 'Comment text must be at most 500 characters long'],
  },
  timestamp: {
    type: Date,
    default: Date.now, // Timestamp of the comment
  },
}, { timestamps: true });

// Mongoose model for TaskComment
const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = { TaskComment };
