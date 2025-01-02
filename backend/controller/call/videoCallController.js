const { VideoCall, validateVideoCall } = require('../models/call/videoCall/videoCallModel');
const { VideoCallParticipant, validateVideoCallParticipant } = require('../models/call/videoCall/videoCallParticipant');
const { User } = require('../models/User');

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

    // Return success response
    return res.status(201).json({
      message: 'Video call created successfully',
      videoCall,
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

    videoCall.status = status || videoCall.status;
    videoCall.end_time = end_time || videoCall.end_time;
    videoCall.duration = duration || videoCall.duration;
    videoCall.updated_at = Date.now();

    await videoCall.save();
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

    videoCall.status = 'cancelled';
    await videoCall.save();

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

    return res.status(201).json({ message: 'User added to the video call successfully', participant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all participants of a video call
const getAllParticipants = async (req, res) => {
  try {
    const { call_id } = req.params;
    const participants = await VideoCallParticipant.find({ call_id }).populate('user_id', 'username full_name');

    if (!participants.length) {
      return res.status(404).json({ message: 'No participants found for this video call' });
    }

    return res.status(200).json({ participants });
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

    return res.status(200).json({ message: 'Participant removed from the video call successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createVideoCall,
  getVideoCallDetails,
  updateVideoCall,
  cancelVideoCall,
  addParticipantToVideoCall,
  getAllParticipants,
  removeParticipantFromVideoCall,
};
