const express = require('express');
const router = express.Router();
const {
  createAudioCall,
  getAudioCallDetails,
  updateAudioCall,
  cancelAudioCall,
  addParticipantToAudioCall,
  getAudioCallParticipants,
  removeParticipantFromAudioCall,
} = require('../controllers/audioCallController');
const { authenticateUser, authorizeUser } = require('../middleware/validateuserStatus');

// Create a new audio call
router.post('/audio-calls', authenticateUser, createAudioCall);

// Get details of a specific audio call by call_id
router.get('/audio-calls/:call_id', authenticateUser, getAudioCallDetails);

// Update the status, end_time, and other details of an audio call
router.put('/audio-calls/:call_id', authenticateUser, authorizeUser('admin'), updateAudioCall);

// Cancel an audio call (set status to cancelled)
router.patch('/audio-calls/:call_id/cancel', authenticateUser, authorizeUser('admin'), cancelAudioCall);

// Add a participant to an audio call
router.post('/audio-calls/:call_id/participants', authenticateUser, addParticipantToAudioCall);

// Get all participants of a specific audio call
router.get('/audio-calls/:call_id/participants', authenticateUser, getAudioCallParticipants);

// Remove a participant from an audio call
router.delete('/audio-calls/:call_id/participants/:user_id', authenticateUser, authorizeUser('admin'), removeParticipantFromAudioCall);

module.exports = router;
