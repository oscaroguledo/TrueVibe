const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Integration schema
const integrationSchema = new Schema(
  {
    integration_name: {
      type: String,
      required: [true, 'Integration name is required'],
      trim: true,
      minlength: [3, 'Integration name should be at least 3 characters long'],
      maxlength: [100, 'Integration name should be less than 100 characters'],
    },
    integration_type: {
      type: String,
      required: [true, 'Integration type is required'],
      enum: ['CRM', 'project management', 'file storage', 'other'], // Adjust as per your needs
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    integration_config: {
      type: Schema.Types.Mixed, // Will store JSON configuration
      required: [true, 'Integration configuration is required'],
      validate: {
        validator: function (v) {
          // Check if the configuration is a valid JSON object
          return v && typeof v === 'object' && !Array.isArray(v);
        },
        message: 'Integration config should be a valid JSON object.',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'inactive'],
      default: 'active', // Default to active
    }
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create the Integration model
const Integration = mongoose.model('Integration', integrationSchema);

module.exports = { Integration };
