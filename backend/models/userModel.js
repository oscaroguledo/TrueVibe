const mongoose = require('mongoose');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Define the Mongoose schema for the user
const userSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    default: uuidv4, // Automatically generate UUID for each new user
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  full_name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3, 
    trim: true 
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  profile_picture_url: { 
    type: String, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  },
  role: { 
    type: String, 
    enum: ['admin', 'member', 'guest'], 
    default: 'member' 
  },
  timezone: { 
    type: String, 
    required: true 
  },
  language: { 
    type: String, 
    required: true 
  },
  group_id: { 
    type: String, 
    ref: 'Group' // Reference to the company this user belongs to
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Mongoose hook to hash the password before saving it
userSchema.pre('save', async function(next) {
  if (this.isModified('password_hash')) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  }
  next();
});

// Mongoose model
const User = mongoose.model('User', userSchema);

// Joi validation schema
const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email.',
      'any.required': 'Email is required.'
    }),
    full_name: Joi.string().min(3).required().messages({
      'string.min': 'Full name must be at least 3 characters long.',
      'any.required': 'Full name is required.'
    }),
    username: Joi.string().min(3).required().messages({
      'string.min': 'Username must be at least 3 characters long.',
      'any.required': 'Username is required.'
    }),
    password_hash: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    }),
    profile_picture_url: Joi.string().uri().optional(),
    status: Joi.string().valid('active', 'inactive').default('active'),
    role: Joi.string().valid('admin', 'member', 'guest').default('member'),
    timezone: Joi.string().required().messages({
      'any.required': 'Timezone is required.'
    }),
    language: Joi.string().required().messages({
      'any.required': 'Language is required.'
    }),
    group_id: Joi.string().optional() // Company reference is optional during user creation, but it should be set for employees
  });

  return schema.validate(user);
};

module.exports = { User, validateUser };
