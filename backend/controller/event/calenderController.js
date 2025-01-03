const CalendarEvent = require('../models/event/calendarEventModel');
const Participant = require('../models/event/participantModel');
const { User } = require('../models/userModel');
const { logAuditAction } = require('../utils/logAuditAction'); // Import the updated logAuditAction

// Create a new calendar event
const createCalendarEvent = async (req, res) => {
  try {
    const { title, description, start_time, end_time, group_id, recurrence_rule, reminder_time, is_recurring } = req.body;

    // Create the new calendar event
    const newEvent = new CalendarEvent({
      title,
      description,
      start_time,
      end_time,
      group_id,
      recurrence_rule,
      reminder_time,
      is_recurring,
      event_type: 'calendar',
      created_by: req.user._id, // Assuming req.user is set with authenticated user info
    });

    // Save the event
    await newEvent.save();
    //notify the group invloved
    // Log the event creation
    logAuditAction(req.user._id, 'create', `Created calendar event: ${newEvent.title}`, {
      event_id: newEvent._id,
      title: newEvent.title,
      description: newEvent.description,
    });

    res.status(201).json({ message: 'Calendar event created successfully', event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all calendar events with pagination
const getAllCalendarEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Paginate and fetch events
    const events = await CalendarEvent.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('group_id')
      .populate('created_by');

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No calendar events found' });
    }

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific calendar event by ID
const getCalendarEventDetails = async (req, res) => {
  try {
    const { event_id } = req.params;
    const event = await CalendarEvent.findById(event_id)
      .populate('group_id')
      .populate('created_by');

    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing calendar event
const updateCalendarEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { title, description, start_time, end_time, group_id, recurrence_rule, reminder_time, is_recurring } = req.body;

    // Find the event
    const event = await CalendarEvent.findById(event_id);

    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.start_time = start_time || event.start_time;
    event.end_time = end_time || event.end_time;
    event.group_id = group_id || event.group_id;
    event.recurrence_rule = recurrence_rule || event.recurrence_rule;
    event.reminder_time = reminder_time || event.reminder_time;
    event.is_recurring = is_recurring !== undefined ? is_recurring : event.is_recurring;

    await event.save();
    //notify the group invloved and participants
    // Log the event update
    logAuditAction(req.user._id, 'update', `Updated calendar event: ${event.title}`, {
      event_id: event._id,
      title: event.title,
      changes: req.body,
    });

    res.status(200).json({ message: 'Calendar event updated successfully', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a calendar event
const deleteCalendarEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    // Find and delete the event
    const event = await CalendarEvent.findByIdAndDelete(event_id);
    // for all partipantsid 
    // // Remove the participant
    // const participant = await Participant.findOneAndDelete({ event_id, user_id });
    

    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }
    //notify the group invloved and participants
    // Log the event deletion
    logAuditAction(req.user._id, 'delete', `Deleted calendar event: ${event.title}`, {
      event_id: event._id,
      title: event.title,
    });

    res.status(200).json({ message: 'Calendar event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a participant to a calendar event
const addParticipantToCalendarEvent = async (req, res) => {
  try {
    const { event_id, user_id } = req.body;

    // Find the event
    const event = await CalendarEvent.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the participant
    const participant = new Participant({
      event_id,
      user_id,
      response: 'tentative',
    });

    
    await participant.save();

    // Link the participant to the event
    event.participants.push(participant._id);
    await event.save();
    // implement notification

    //notify the group invloved
    // Log the addition of the participant
    logAuditAction(req.user._id, 'update', `Added participant to calendar event: ${event.title}`, {
      event_id,
      user_id,
    });

    res.status(201).json({ message: 'Participant added to calendar event', participant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all participants of a calendar event
const getParticipantsOfCalendarEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    // Find the event
    const event = await CalendarEvent.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    // Get the participants
    const participants = await Participant.find({ event_id });

    if (participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this event' });
    }

    res.status(200).json({ participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a participant from a calendar event
const removeParticipantFromCalendarEvent = async (req, res) => {
  try {
    const { event_id, user_id } = req.params;

    // Remove the participant
    const participant = await Participant.findOneAndDelete({ event_id, user_id });
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found in this calendar event' });
    }
    // Find the event
    const event = await CalendarEvent.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Calendar event not found' });
    }

    // implement notification

    //notify the group invloved
    // Log the addition of the participant
    logAuditAction(req.user._id, 'update', `Removed participant from calendar event: ${event.title}`, {
        event_id,
        user_id,
      });
    res.status(200).json({ message: 'Participant removed from calendar event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCalendarEvent,
  getAllCalendarEvents,
  getCalendarEventDetails,
  updateCalendarEvent,
  deleteCalendarEvent,
  addParticipantToCalendarEvent,
  getParticipantsOfCalendarEvent,
  removeParticipantFromCalendarEvent,
};
