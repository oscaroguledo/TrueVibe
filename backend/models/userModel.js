const mongoose = require('mongoose');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, generateSalt } = require('../utils/encryption');

// Define the Mongoose schema for the user
const userSchema = new mongoose.Schema({
  id: { 
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
    required: true,
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
    ref: 'Group' // Reference to the group this user belongs to
  },
  internet_status: {
    type: String,
    enum: ['offline', 'online'], 
    default: 'offline',
    maxlength: 255
  },
  
}, { timestamps: true });

// Mongoose hook to hash the password before saving it
userSchema.pre('save', async function(next) {
  if (this.isModified('password_hash')) {
   
    const salt = generateSalt();  // Generate a random salt
    const hashedPassword = await hashPassword(this.password_hash, salt);  // Hash the password with the salt
    
    this.password_hash =hashedPassword;

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
// Custom validation for PATCH requests
const validateUserPatch = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().optional().messages({
      'string.email': 'Please provide a valid email.',
    }),
    full_name: Joi.string().min(3).optional().messages({
      'string.min': 'Full name must be at least 3 characters long.',
    }),
    username: Joi.string().min(3).optional().messages({
      'string.min': 'Username must be at least 3 characters long.',
    }),
    password_hash: Joi.string().min(6).optional().messages({
      'string.min': 'Password must be at least 6 characters long.',
    }),
    profile_picture_url: Joi.string().uri().optional().messages({
      'string.uri': 'Profile picture URL must be a valid URI.',
    }),
    status: Joi.string().valid('active', 'inactive').optional().default('active'),
    role: Joi.string().valid('admin', 'member', 'guest').optional().default('member'),
    timezone: Joi.string().optional().messages({
      'any.required': 'Timezone is required.',
    }),
    language: Joi.string().optional().messages({
      'any.required': 'Language is required.',
    }),
    group_id: Joi.string().optional() // Company reference is optional
  }).min(1);  // Ensure that at least one field is provided for update

  return schema.validate(user);
};

module.exports = { User, validateUser,validateUserPatch };
