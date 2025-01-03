const express = require('express');
const router = express.Router();
const {
  createTask,
  updateTask,
  getTasks,
  getTaskById,
  deleteTask,
  markTaskAsCompleted,
  createComment,
  getCommentsForTask,
  updateComment,
  deleteComment
} = require('../controller/taskController');

// Task Routes
router.post('/', createTask);  // Create a new task
router.put('/:task_id', updateTask);  // Update a task
router.get('/', getTasks);  // Get all tasks with optional filters
router.get('/:task_id', getTaskById);  // Get a specific task by ID
router.delete('/:task_id', deleteTask);  // Delete a task
router.put('/:task_id/complete', markTaskAsCompleted);  // Mark task as completed

// Task Comment Routes
router.post('/:task_id/comments', createComment);  // Add a comment to a task
router.get('/:task_id/comments', getCommentsForTask);  // Get all comments for a task
router.delete('/comments/:comment_id', deleteComment);  // Delete a comment
router.put('/comments/:comment_id', updateComment);  // Update a comment


module.exports = router;
