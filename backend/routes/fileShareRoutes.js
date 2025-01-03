const express = require('express');
const router = express.Router();

const {
  uploadFile,
  getFileById,
  getAllFiles,
  updateFile,
  deleteFile,
  shareFileWithUser,
  getFileShares,
  revokeFileShare,
} = require('../controller/fileShareController'); // Assuming controllers are located in this path

const { authenticateUser } = require('../middlewares/validateuserStatus'); // Assuming you have an auth middleware for user authentication

// Route to upload a file
router.post('/', authenticateUser, uploadFile);

// Route to get a file by its ID
router.get('/:file_id', authenticateUser, getFileById);

// Route to get all files uploaded by the authenticated user
router.get('/', authenticateUser, getAllFiles);

// Route to update file metadata (e.g., file name, privacy level)
router.put('/:file_id', authenticateUser, updateFile);

// Route to delete a file
router.delete('/:file_id', authenticateUser, deleteFile);

// Route to share a file with a user
router.post('/:file_id/share', authenticateUser, shareFileWithUser);

// Route to get all users who have access to a file
router.get('/:file_id/shares', authenticateUser, getFileShares);

// Route to revoke a user's access to a file
router.delete('/:file_id/share/:user_id', authenticateUser, revokeFileShare);

module.exports = router;
