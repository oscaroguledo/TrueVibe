const express = require('express');
const router = express.Router();
const {
  createVideoCall,
  getAllVideoCalls,
  getVideoCallDetails,
  updateVideoCall,
  cancelVideoCall,
  addParticipantToVideoCall,
  getAllParticipants,
  removeParticipantFromVideoCall
} = require('../../controller/call/videoCallController');
const { authenticateUser, authorizeUser } = require('../../middlewares/validateuserStatus');

// Create a new video call
router.post('/', authenticateUser, createVideoCall);

// get all video calls
router.get('/', authenticateUser, getAllVideoCalls);

// Get details of a specific video call by call_id
router.get('/:call_id', authenticateUser, getVideoCallDetails);

// Update the status, end_time, and other details of a video call
router.put('/:call_id', authenticateUser, authorizeUser('admin'), updateVideoCall);

// Cancel a video call (set status to cancelled)
router.patch('/:call_id/cancel', authenticateUser, authorizeUser('admin'), cancelVideoCall);

// Add a participant to a video call
router.post('/:call_id/participants', authenticateUser, addParticipantToVideoCall);

// Get all participants of a specific video call
router.get('/:call_id/participants', authenticateUser, getAllParticipants);

// Remove a participant from a video call
router.delete('/:call_id/participants/:user_id', authenticateUser, authorizeUser('admin'), removeParticipantFromVideoCall);

module.exports = router;
