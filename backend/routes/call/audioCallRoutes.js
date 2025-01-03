const express = require('express');
const router = express.Router();
const {
  createAudioCall,
  getAllAudioCalls,
  getAudioCallDetails,
  updateAudioCall,
  cancelAudioCall,
  addParticipantToAudioCall,
  getAudioCallParticipants,
  removeParticipantFromAudioCall,
} = require('../../controller/call/audioCallController');
const { authenticateUser, authorizeUser } = require('../middleware/validateuserStatus');

// Create a new audio call
router.post('/', authenticateUser, createAudioCall);

// Create a new video call
router.post('/', authenticateUser, getAllAudioCalls);

// Get details of a specific audio call by call_id
router.get('/:call_id', authenticateUser, getAudioCallDetails);

// Update the status, end_time, and other details of an audio call
router.put('/:call_id', authenticateUser, authorizeUser('admin'), updateAudioCall);

// Cancel an audio call (set status to cancelled)
router.patch('/:call_id/cancel', authenticateUser, authorizeUser('admin'), cancelAudioCall);

// Add a participant to an audio call
router.post('/:call_id/participants', authenticateUser, addParticipantToAudioCall);

// Get all participants of a specific audio call
router.get('/:call_id/participants', authenticateUser, getAudioCallParticipants);

// Remove a participant from an audio call
router.delete('/:call_id/participants/:user_id', authenticateUser, authorizeUser('admin'), removeParticipantFromAudioCall);

module.exports = router;
