const express = require('express');
const router = express.Router();
const {
  createVideoCall,
  getVideoCallDetails,
  updateVideoCall,
  cancelVideoCall,
  addParticipantToVideoCall,
  getAllParticipants,
  removeParticipantFromVideoCall
} = require('../controllers/call/videoCallController');
const { authenticateUser, authorizeUser } = require('../middleware/validateuserStatus');

// Create a new video call
router.post('/video-calls', authenticateUser, createVideoCall);

// Get details of a specific video call by call_id
router.get('/video-calls/:call_id', authenticateUser, getVideoCallDetails);

// Update the status, end_time, and other details of a video call
router.put('/video-calls/:call_id', authenticateUser, authorizeUser('admin'), updateVideoCall);

// Cancel a video call (set status to cancelled)
router.patch('/video-calls/:call_id/cancel', authenticateUser, authorizeUser('admin'), cancelVideoCall);

// Add a participant to a video call
router.post('/video-calls/:call_id/participants', authenticateUser, addParticipantToVideoCall);

// Get all participants of a specific video call
router.get('/video-calls/:call_id/participants', authenticateUser, getAllParticipants);

// Remove a participant from a video call
router.delete('/video-calls/:call_id/participants/:user_id', authenticateUser, authorizeUser('admin'), removeParticipantFromVideoCall);

module.exports = router;
