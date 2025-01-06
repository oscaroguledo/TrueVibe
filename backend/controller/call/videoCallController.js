const { VideoCall, validateVideoCall } = require('../../models/call/videoCall/videoCallModel');
const { VideoCallParticipant, validateVideoCallParticipant } = require('../../models/call/videoCall/videoCallParticipantsModel');
const { User } = require('../../models/userModel');
const { paginate } = require('../../utils/paginationUtil');  // Import pagination utility
const { logAuditAction } = require('../../utils/logAuditAction');

// Create a new video call
const createVideoCall = async (req, res) => {
  try {
    const { error, value } = validateVideoCall(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the host exists
    const host = await User.findById(value.host_id);
    if (!host) {
      return res.status(404).json({ message: 'Host user not found' });
    }

    // Create a new video call
    const videoCall = new VideoCall(value);
    await videoCall.save();

    // Log the creation of a new video call
    await logAuditAction(
      req.user.user_id,  // Assuming `req.user.user_id` has the user making the request
      'create',
      `Created a new video call with ID ${videoCall.call_id}`,
      { call_id: videoCall.call_id, host_id: value.host_id }
    );

    return res.status(201).json({
      message: 'Video call created successfully',
      videoCall,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all video calls with pagination
const getAllVideoCalls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for video calls
    const { data: videoCalls, pagination } = await paginate(
      VideoCall, 
      {}, // No filter, fetch all video calls
      page, 
      limit
    );

    if (videoCalls.length === 0) {
      return res.status(404).json({ message: 'No video calls found' });
    }

    return res.status(200).json({
      videoCalls,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get details of a video call by call_id
const getVideoCallDetails = async (req, res) => {
  try {
    const { call_id } = req.params;
    const videoCall = await VideoCall.findOne({ call_id });

    if (!videoCall) {
      return res.status(404).json({ message: 'Video call not found' });
    }

    return res.status(200).json({ videoCall });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update a video call (e.g., end the call, change status)
const updateVideoCall = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { status, end_time, duration } = req.body;

    const videoCall = await VideoCall.findOne({ call_id });
    if (!videoCall) {
      return res.status(404).json({ message: 'Video call not found' });
    }

    const oldStatus = videoCall.status;
    videoCall.status = status || videoCall.status;
    videoCall.end_time = end_time || videoCall.end_time;
    videoCall.duration = duration || videoCall.duration;
    videoCall.updated_at = Date.now();

    await videoCall.save();

    // Log the video call update action
    await logAuditAction(
      req.user.user_id,
      'update',
      `Updated video call status from ${oldStatus} to ${videoCall.status}`,
      { call_id: videoCall.call_id, old_status: oldStatus, new_status: videoCall.status }
    );

    return res.status(200).json({ message: 'Video call updated successfully', videoCall });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a video call
const cancelVideoCall = async (req, res) => {
  try {
    const { call_id } = req.params;
    const videoCall = await VideoCall.findOne({ call_id });

    if (!videoCall) {
      return res.status(404).json({ message: 'Video call not found' });
    }

    const oldStatus = videoCall.status;
    videoCall.status = 'cancelled';
    await videoCall.save();

    // Log the cancellation of the video call
    await logAuditAction(
      req.user.user_id,
      'update',
      `Cancelled video call with ID ${call_id}`,
      { call_id: videoCall.call_id, old_status: oldStatus, new_status: 'cancelled' }
    );

    return res.status(200).json({ message: 'Video call cancelled successfully', videoCall });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a participant to a video call
const addParticipantToVideoCall = async (req, res) => {
  try {
    const { call_id, user_id } = req.body;

    // Validate participant
    const { error, value } = validateVideoCallParticipant({ call_id, user_id, joined_at: new Date() });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the call exists
    const videoCall = await VideoCall.findOne({ call_id });
    if (!videoCall) {
      return res.status(404).json({ message: 'Video call not found' });
    }

    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add participant to the video call
    const participant = new VideoCallParticipant(value);
    await participant.save();

    // Log the addition of a participant to the video call
    await logAuditAction(
      req.user.user_id,
      'create',
      `Added user ${user.full_name} to video call with ID ${call_id}`,
      { call_id, user_id }
    );

    return res.status(201).json({ message: 'User added to the video call successfully', participant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all participants of a video call
// Get all participants in a video call with pagination
const getAllParticipants = async (req, res) => {
  try {
    const { call_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for video call participants
    const { data: participants, pagination } = await paginate(
      VideoCallParticipant, 
      { call_id }, 
      page, 
      limit
    );

    if (participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this video call' });
    }

    return res.status(200).json({
      participants,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove a participant from a video call
const removeParticipantFromVideoCall = async (req, res) => {
  try {
    const { call_id, user_id } = req.params;

    // Find and remove the participant
    const participant = await VideoCallParticipant.findOneAndDelete({ call_id, user_id });
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found in this video call' });
    }

    // Log the removal of a participant
    await logAuditAction(
      req.user.user_id,
      'delete',
      `Removed user ${user_id} from video call with ID ${call_id}`,
      { call_id, user_id }
    );

    return res.status(200).json({ message: 'Participant removed from the video call successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createVideoCall,
  getAllVideoCalls,
  getVideoCallDetails,
  updateVideoCall,
  cancelVideoCall,
  addParticipantToVideoCall,
  getAllParticipants,
  removeParticipantFromVideoCall,
};
