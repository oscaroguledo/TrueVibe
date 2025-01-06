const { File } = require('../models/fileshare/fileModel');
const { User } = require('../models/userModel'); // Assuming User model exists
const { FileShare } = require('../models/fileshare/fileShareModel');
const { paginate } = require('../utils/paginationUtil');  // Import pagination utility
const { logAuditAction } = require('../utils/logAuditAction');

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const { file_name, file_type, file_url, size, privacy_level } = req.body;

    // Ensure the file is uploaded (this can be done using a middleware for file upload, like multer)
    if (!file_name || !file_url || !size) {
      return res.status(400).json({ message: "File name, file URL, and size are required." });
    }

    // Validate the user (optional step, can be handled in authentication middleware)
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new file
    const newFile = new File({
      user_id: req.user.user_id,
      file_name,
      file_type,
      file_url,
      size,
      privacy_level,
    });

    await newFile.save();
    // Log the file upload action
    await logAuditAction(
      req.user.user_id,  // Assuming user_id is in the request (e.g., from authentication middleware)
      'create',
      `Uploaded a new file: ${newFile.file_name}`,
      { file_id: newFile._id, file_name: newFile.file_name }
    );

    return res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get a file by ID
const getFileById = async (req, res) => {
  try {
    const { file_id } = req.params;
    const file = await File.findOne({ file_id });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.status(200).json({ file });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all files uploaded by the authenticated user
// Get all files uploaded by the authenticated user with pagination
const getAllFiles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility to fetch paginated files for the user
    const { data: files, pagination } = await paginate(File, { user_id: req.user.user_id }, page, limit);

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    return res.status(200).json({
      files,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Update file metadata (e.g., file name, privacy level)
const updateFile = async (req, res) => {
  try {
    const { file_id } = req.params;
    const { file_name, privacy_level } = req.body;

    const file = await File.findOne({ file_id });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    file.file_name = file_name || file.file_name;
    file.privacy_level = privacy_level || file.privacy_level;
    file.updated_at = Date.now();

    await file.save();
    // Log the file update action
    await logAuditAction(
      req.user.user_id, 
      'update',
      `Updated file: ${file.file_name}`,
      { file_id: file._id, file_name: file.file_name }
    );
    return res.status(200).json({ message: 'File updated successfully', file });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    const { file_id } = req.params;
    const file = await File.findOne({ file_id });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await file.remove();
    // Log the file deletion action
    await logAuditAction(
      req.user.user_id, 
      'delete',
      `Deleted file: ${file.file_name}`,
      { file_id: file._id, file_name: file.file_name }
    );
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Share a file with a user
const shareFileWithUser = async (req, res) => {
  try {
    const { file_id } = req.params;
    const { user_id } = req.body;

    // Validate the file
    const file = await File.findOne({ file_id });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Validate the user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has access
    const existingShare = await FileShare.findOne({ file_id, user_id });
    if (existingShare) {
      return res.status(400).json({ message: 'User already has access to this file' });
    }

    // Share the file with the user
    const fileShare = new FileShare({
      file_id,
      user_id,
      shared_at: Date.now(),
    });

    await fileShare.save();
    // Log the file share action
    await logAuditAction(
      req.user.user_id, 
      'create',
      `Shared file: ${file.file_name} with user: ${user.full_name}`,
      { file_id: file._id, file_name: file.file_name, user_id: user._id, user_name: user.full_name }
    );
    return res.status(201).json({ message: 'File shared successfully', fileShare });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all users who have access to a file
// Get all users who have access to a file with pagination
const getFileShares = async (req, res) => {
  try {
    const { file_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility to fetch paginated file shares
    const { data: fileShares, pagination } = await paginate(FileShare, { file_id }, page, limit);

    if (fileShares.length === 0) {
      return res.status(404).json({ message: 'No users found with access to this file' });
    }

    return res.status(200).json({
      fileShares,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Revoke a user's access to a file
const revokeFileShare = async (req, res) => {
  try {
    const { file_id, user_id } = req.params;

    const fileShare = await FileShare.findOneAndDelete({ file_id, user_id });

    if (!fileShare) {
      return res.status(404).json({ message: 'No share record found for this file and user' });
    }
    // Log the action of revoking the file share
    await logAuditAction(
      req.user.user_id, 
      'delete',
      `Revoked access to file: ${file_id} from user: ${user_id}`,
      { file_id, user_id }
    );
    return res.status(200).json({ message: 'File share revoked successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  uploadFile,
  getFileById,
  getAllFiles,
  updateFile,
  deleteFile,
  shareFileWithUser,
  getFileShares,
  revokeFileShare,
};
