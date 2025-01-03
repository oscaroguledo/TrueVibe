const { User, validateUser } = require('../models/userModel'); // Import the User model and Joi validation
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { paginate } = require('../utils/paginationUtil'); // Assuming you have a pagination utility
const { logAuditAction } = require('../utils/logAuditAction');

// Create User
const createUser = async (req, res) => {
  try {
    // Validate input data using Joi
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { username: value.username }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists.' });
    }

    // Create a new user
    const user = new User(value);
    await user.save();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'create',
      `Created a User: ${user._id}`,
      { user_id: user._id, email:user.email }
    );

    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get All Users
// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    // Destructure page and limit from query parameters, with defaults
    const { page = 1, limit = 10 } = req.query;

    // Use the paginate utility to fetch users
    const { data: users, pagination } = await paginate(User, {}, page, limit);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the paginated users with pagination metadata
    return res.status(200).json({
      message: 'Users retrieved successfully',
      users,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User retrieved successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Validate input data using Joi
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOneAndUpdate({ user_id }, value, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a User: ${user._id}`,
      { user_id: user._id}
    );

    return res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findOneAndDelete({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a User: ${user._id}`,
      { user_id: user._id}
    );

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User Login (authentication)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate the user login credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the logged-in user
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET_KEY, // Use an environment variable for the secret key
      { expiresIn: '1h' } // Set the expiration time for the token
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { user_id } = req.params;
  const { oldPassword, newPassword } = req.body;
  try {
    // Find the user by user_id
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the current password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password and save it
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a User Password: ${user._id}`,
      { user_id: user._id}
    );

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile Picture
const updateProfilePicture = async (req, res) => {
  const { user_id } = req.params;
  const { profile_picture_url } = req.body;
  try {
    // Validate the URL for profile picture
    if (!profile_picture_url || !/^https?:\/\/[^\s]+$/.test(profile_picture_url)) {
      return res.status(400).json({ message: 'Please provide a valid image URL.' });
    }

    // Find the user and update the profile picture
    const user = await User.findOneAndUpdate(
      { user_id },
      { profile_picture_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'update',
      `Updated a User Profile Picture: ${user._id}`,
      { user_id: user._id}
    );

    return res.status(200).json({
      message: 'Profile picture updated successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  updateProfilePicture,
};
