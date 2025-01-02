const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
const { ChannelMember } = require('../models/channel/channelMember');

// Middleware for authenticating the user
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user information to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware for authorizing user based on role
const authorizeUser = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user || user.role !== role) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  };
};


const isChannelAdmin = async (req, res, next) => {
    const { channel_id } = req.params;
    const currentUser = req.user; // The authenticated user
    const member = await ChannelMember.findOne({ channel_id, user_id: currentUser.user_id });
  
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Only admins can perform this action.' });
    }
  
    next(); // Proceed to the next middleware or route handler
  };
 
module.exports ={isChannelAdmin, authenticateUser, authorizeUser }