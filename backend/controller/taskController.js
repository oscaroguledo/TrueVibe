const { Task } = require('../models/task/taskModel');
const { User } = require('../models/userModel');
const { TaskComment } = require('../models/task/taskCommentModel');
const { paginate } = require('../utils/paginationUtil'); // Assuming you have a pagination utility
const { logAuditAction } = require('../utils/logAuditAction');
// Create a new task
const createTask = async (req, res) => {
  try {
    const { task_title, task_description, assigned_to, created_by, due_date, status, priority } = req.body;
    
    const newTask = new Task({
      task_title,
      task_description,
      assigned_to,
      created_by,
      due_date,
      status,
      priority,
    });
    
    await newTask.save();
    // Log the action in the background
    await logAuditAction(
      user_id,
      'create',
      `Created a task: ${task_title}`,
      { task_id: newTask._id, task_title }
    );

    
    return res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { task_title, task_description, assigned_to, due_date, status, priority } = req.body;
    
    const task = await Task.findOne({ task_id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.task_title = task_title || task.task_title;
    task.task_description = task_description || task.task_description;
    task.assigned_to = assigned_to || task.assigned_to;
    task.due_date = due_date || task.due_date;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.updated_at = Date.now();
    
    await task.save();
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a task: ${task.task_title}`,
      { task_id: task._id, task_title:task.task_title }
    );
    
    return res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks with optional filters (status, assignee, etc.)

// Get tasks with filters, sorting, and pagination
const getTasks = async (req, res) => {
  try {
    const { status, assigned_to, created_by, priority, sort_by, sort_order } = req.query;
    const { page = 1, limit = 10 } = req.query; // Destructure page and limit for pagination

    let query = {}; // Initial empty query for filters

    if (status) query.status = status;
    if (assigned_to) query.assigned_to = assigned_to;
    if (created_by) query.created_by = created_by;
    if (priority) query.priority = priority;

    // Sorting
    const sort = {};
    if (sort_by) sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Use the paginate utility to fetch tasks with the query, sort, page, and limit
    const { data: tasks, pagination } = await paginate(Task, query, page, limit, sort);

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // Return the paginated tasks with pagination metadata
    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Get a specific task by ID
const getTaskById = async (req, res) => {
  try {
    const { task_id } = req.params;
    
    const task = await Task.findOne({ task_id }).populate('assigned_to', 'username').populate('created_by', 'username');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    return res.status(200).json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    
    const task = await Task.findOneAndDelete({ task_id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a task: ${task.task_title}`,
      { task_id: task._id, task_title:task.task_title }
    );
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Mark a task as completed
const markTaskAsCompleted = async (req, res) => {
  try {
    const { task_id } = req.params;
    
    const task = await Task.findOne({ task_id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = 'completed';
    task.updated_at = Date.now();
    
    await task.save();
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a task as complete: ${task.task_title}`,
      { task_id: task._id, task_title:task.task_title }
    );
    return res.status(200).json({
      message: 'Task marked as completed successfully',
      task,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Create a comment for a task
const createComment = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { user_id, comment_text } = req.body;

    const newComment = new TaskComment({
      task_id,
      user_id,
      comment_text,
    });

    await newComment.save();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'create',
      `Created a Comment: ${newComment._id}`,
      { comment_id: newComment._id, task_id:newComment.task_id }
    );
    return res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments for a task
// Get comments for a task with pagination
const getCommentsForTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default pagination values

    // Use the paginate utility to get paginated comments
    const { data: comments, pagination } = await paginate(TaskComment, { task_id }, page, limit, { timestamp: -1 });

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this task' });
    }

    // Return the paginated comments along with pagination info
    return res.status(200).json({
      message: 'Comments retrieved successfully',
      comments,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Update a task comment
const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { comment_text } = req.body;

    // Find the comment by its ID
    const comment = await TaskComment.findOne({ comment_id });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if the user is the one who created the comment (optional authorization check)
    // const user = req.user;  // Assuming you have user authentication middleware
    // if (comment.user_id.toString() !== user.user_id) {
    //   return res.status(403).json({ message: 'You are not authorized to update this comment' });
    // }

    // Update the comment text
    comment.comment_text = comment_text;
    comment.timestamp = Date.now(); // Optional: update the timestamp when the comment is edited

    // Save the updated comment
    await comment.save();
    
    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a Comment: ${comment._id}`,
      { comment_id: comment._id, task_id:comment.task_id }
    );

    return res.status(200).json({
      message: 'Comment updated successfully',
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await TaskComment.findOneAndDelete({ comment_id });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a Comment: ${comment._id}`,
      { comment_id: comment._id, task_id:comment.task_id }
    );

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
  markTaskAsCompleted,
  createComment,
  getCommentsForTask,
  updateComment,
  deleteComment
};
