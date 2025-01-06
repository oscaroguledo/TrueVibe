const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the Mongoose schema for tasks
const taskSchema = new mongoose.Schema({
  task_id: {
    type: String,
    default: uuidv4,  // Auto-generate UUID for each task
    unique: true,  // Ensure task_id is unique
  },
  task_title: {
    type: String,
    required: [true, 'Task title is required'],
    minlength: [3, 'Task title must be at least 3 characters long'],
    maxlength: [255, 'Task title must be at most 255 characters long'],
  },
  task_description: {
    type: String,
    required: [true, 'Task description is required'],
    minlength: [10, 'Task description must be at least 10 characters long'],
    maxlength: [1000, 'Task description must be at most 1000 characters long'],
  },
  assigned_to: {
    type: String,
    required: [true, 'Assigned user ID is required'],
    ref: 'User', // Reference to the User who the task is assigned to
    validate: {
      validator: async function(v) {
        const userExists = await mongoose.models.User.exists({ user_id: v });
        return userExists;  // Check if the user exists
      },
      message: 'Assigned user with the specified user_id does not exist',
    },
  },
  created_by: {
    type: String,
    required: [true, 'Creator user ID is required'],
    ref: 'User', // Reference to the User who created the task
    validate: {
      validator: async function(v) {
        const userExists = await mongoose.models.User.exists({ user_id: v });
        return userExists;  // Check if the user exists
      },
      message: 'Creator user with the specified user_id does not exist',
    },
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v); // Validate if it's a valid date
      },
      message: 'Invalid due date format',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending', // Default status is 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium', // Default priority is 'medium'
  },
}, { timestamps: true });

// Mongoose model for Task
const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };
