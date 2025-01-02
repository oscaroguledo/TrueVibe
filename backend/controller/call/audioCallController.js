const { AudioCall } = require('../models/AudioCall');
const { AudioCallParticipant } = require('../models/call/audiocall/audioCallParticipant');
const { User } = require('../models/userModel');

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

    return res.status(201).json({
      message: 'Audio call created successfully',
      call: newCall,
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

    call.status = status || call.status;
    call.end_time = end_time || call.end_time;
    call.duration = duration || call.duration;
    await call.save();

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

    call.status = 'cancelled';
    await call.save();

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

    return res.status(201).json({ message: 'User added to audio call', participant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all participants of a specific audio call
const getAudioCallParticipants = async (req, res) => {
  try {
    const { call_id } = req.params;
    const participants = await AudioCallParticipant.find({ call_id }).populate('user_id', 'username full_name');

    if (!participants.length) {
      return res.status(404).json({ message: 'No participants found for this audio call' });
    }

    return res.status(200).json({ participants });
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

    return res.status(200).json({ message: 'Participant removed from audio call' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAudioCall,
  getAudioCallDetails,
  updateAudioCall,
  cancelAudioCall,
  addParticipantToAudioCall,
  getAudioCallParticipants,
  removeParticipantFromAudioCall,
};
