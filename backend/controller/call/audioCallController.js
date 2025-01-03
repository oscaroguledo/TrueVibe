const { AudioCall } = require('../models/call/audioCall/audioCallModel');
const { AudioCallParticipant } = require('../models/call/audioCall/audioCallParticipant');
const { User } = require('../models/userModel');
const { paginate } = require('../utils/paginationUtil');  // Import pagination utility
const { logAuditAction } = require('../utils/logAuditAction');

// Create a new audio call
const createAudioCall = async (req, res) => {
  try {
    const { host_id, call_type, start_time, room_id } = req.body;

    // Validate host exists
    const host = await User.findById(host_id);
    if (!host) {
      return res.status(404).json({ message: 'Host user not found' });
    }

    // Create the new audio call
    const newCall = new AudioCall({
      host_id,
      call_type,
      start_time,
      room_id,
    });

    await newCall.save();

    // Log the creation of a new audio call
    await logAuditAction(
      req.user.user_id,  // Assuming `req.user.user_id` is the user making the request
      'create',
      `Created a new audio call with ID ${newCall.call_id}`,
      { call_id: newCall.call_id, host_id }
    );

    return res.status(201).json({
      message: 'Audio call created successfully',
      call: newCall,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all audio calls with pagination
const getAllAudioCalls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for audio calls
    const { data: audioCalls, pagination } = await paginate(
      AudioCall, 
      {}, // No filter, fetch all audio calls
      page, 
      limit
    );

    if (audioCalls.length === 0) {
      return res.status(404).json({ message: 'No audio calls found' });
    }

    return res.status(200).json({
      audioCalls,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get details of a specific audio call
const getAudioCallDetails = async (req, res) => {
  try {
    const { call_id } = req.params;
    const call = await AudioCall.findOne({ call_id });

    if (!call) {
      return res.status(404).json({ message: 'Audio call not found' });
    }

    return res.status(200).json({ call });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update audio call (status, end_time, etc.)
const updateAudioCall = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { status, end_time, duration } = req.body;

    const call = await AudioCall.findOne({ call_id });
    if (!call) {
      return res.status(404).json({ message: 'Audio call not found' });
    }

    const oldStatus = call.status;
    call.status = status || call.status;
    call.end_time = end_time || call.end_time;
    call.duration = duration || call.duration;
    await call.save();

    // Log the update action
    await logAuditAction(
      req.user.user_id,
      'update',
      `Updated audio call status from ${oldStatus} to ${call.status}`,
      { call_id: call.call_id, old_status: oldStatus, new_status: call.status }
    );

    return res.status(200).json({ message: 'Audio call updated successfully', call });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cancel an audio call (set status to cancelled)
const cancelAudioCall = async (req, res) => {
  try {
    const { call_id } = req.params;
    const call = await AudioCall.findOne({ call_id });

    if (!call) {
      return res.status(404).json({ message: 'Audio call not found' });
    }

    const oldStatus = call.status;
    call.status = 'cancelled';
    await call.save();

    // Log the cancellation of the audio call
    await logAuditAction(
      req.user.user_id,
      'update',
      `Cancelled audio call with ID ${call_id}`,
      { call_id: call.call_id, old_status: oldStatus, new_status: 'cancelled' }
    );

    return res.status(200).json({ message: 'Audio call cancelled successfully', call });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a participant to an audio call
const addParticipantToAudioCall = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { user_id } = req.body;

    const call = await AudioCall.findOne({ call_id });
    if (!call) {
      return res.status(404).json({ message: 'Audio call not found' });
    }

    const participant = new AudioCallParticipant({
      call_id,
      user_id,
    });

    await participant.save();

    // Log the addition of a participant
    await logAuditAction(
      req.user.user_id,
      'create',
      `Added user ${user_id} to audio call with ID ${call_id}`,
      { call_id, user_id }
    );

    return res.status(201).json({ message: 'User added to audio call', participant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all participants of a specific audio call
// Get all participants of an audio call with pagination
const getAudioCallParticipants = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1, limit 10

    // Use the paginate utility to fetch the participants
    const { data: participants, pagination } = await paginate(
      AudioCallParticipant,
      { call_id }, // Filter by call_id
      page,         // Page number
      limit         // Limit of participants per page
    );

    if (participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this audio call' });
    }

    return res.status(200).json({
      participants,
      pagination,  // Include pagination metadata in the response
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove a participant from an audio call
const removeParticipantFromAudioCall = async (req, res) => {
  try {
    const { call_id, user_id } = req.params;

    const participant = await AudioCallParticipant.findOneAndDelete({ call_id, user_id });
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found in this audio call' });
    }

    // Log the removal of a participant
    await logAuditAction(
      req.user.user_id,
      'delete',
      `Removed user ${user_id} from audio call with ID ${call_id}`,
      { call_id, user_id }
    );

    return res.status(200).json({ message: 'Participant removed from audio call' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAudioCall,
  getAllAudioCalls,
  getAudioCallDetails,
  updateAudioCall,
  cancelAudioCall,
  addParticipantToAudioCall,
  getAudioCallParticipants,
  removeParticipantFromAudioCall,
};
