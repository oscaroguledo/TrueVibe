const express = require('express');
const router = express.Router();

// Import User controllers
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  updateProfilePicture
} = require('../controllers/userController');

// **User Operations**
router.post('/', createUser); // Create a new user
router.get('/', getAllUsers); // Get all users
router.get('/:user_id', getUserById); // Get user by ID
router.put('/:user_id', updateUser); // Update user details
router.delete('/:user_id', deleteUser); // Delete user by ID

// **User Authentication**
router.post('/login', loginUser); // User login

// **Password Management**
router.put('/:user_id/password', changePassword); // Change user password

// **Profile Management**
router.put('/:user_id/profile-picture', updateProfilePicture); // Update profile picture

module.exports = router;
