const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Group Schema definition
const groupSchema = new mongoose.Schema({
  group_id: {
    type: String,
    default: uuidv4, // Generate UUID for each group
    unique: true,
  },
  name: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 3 // Group name should be at least 3 characters
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  status: { 
    type: String, 
    enum: ['active', 'archive'], 
    default: 'active' 
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // URL for the image (logo, cover, etc.)
    required: false,
    validate: {
      validator: function(v) {
        // Validate the image URL format (basic URL validation)
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i.test(v);
      },
      message: 'Please provide a valid image URL (png, jpg, jpeg, gif, bmp, svg).'
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  employees: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' // Reference to the User model
    }
  ],
  group_admins: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // The admin of the group
      required: true
    }
  ],
});

// Mongoose model for the group
const Group = mongoose.model('Group', groupSchema);
// Joi validation schema for the Group
const validateGroup = (group) => {
    const schema = Joi.object({
      name: Joi.string()
        .min(3)
        .required()
        .messages({
          'string.min': 'Group name must be at least 3 characters long.',
          'any.required': 'Group name is required.',
        }),
      
      industry: Joi.string()
        .required()
        .messages({
          'any.required': 'Industry is required.',
        }),
  
      country: Joi.string()
        .required()
        .messages({
          'any.required': 'Country is required.',
        }),
  
      image: Joi.string()
        .uri()
        .optional()
        .messages({
          'string.uri': 'Please provide a valid URL for the image.',
        }),
  
      employees: Joi.array()
        .items(Joi.string().uuid()) // Validate that each employee is a valid UUID
        .optional(),
  
      group_admins: Joi.array()
        .items(Joi.string().uuid())
        .required()
        .messages({
          'any.required': 'Group admins are required.',
        }),
    });
  
    return schema.validate(group);
  };
  
  module.exports = { Group,validateGroup };
module.exports = Group;
