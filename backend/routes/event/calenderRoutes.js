const express = require('express');
const router = express.Router();
const {
  createCalendarEvent,
  getAllCalendarEvents,
  getCalendarEventDetails,
  updateCalendarEvent,
  deleteCalendarEvent,
  addParticipantToCalendarEvent,
  getParticipantsOfCalendarEvent,
  removeParticipantFromCalendarEvent
} = require('../../controller/event/calenderController');  // Path to your controller

// Route to create a new calendar event
router.post('/', createCalendarEvent);

// Route to get all calendar events with pagination
router.get('/', getAllCalendarEvents);

// Route to get a specific calendar event by ID
router.get('/:event_id', getCalendarEventDetails);

// Route to update a calendar event
router.put('/:event_id', updateCalendarEvent);

// Route to delete a calendar event
router.delete('/:event_id', deleteCalendarEvent);

// Route to add a participant to a calendar event
router.post('/:event_id/participants', addParticipantToCalendarEvent);

// Route to get all participants of a specific calendar event
router.get('/:event_id/participants', getParticipantsOfCalendarEvent);

// Route to remove a participant from a calendar event
router.delete('/:event_id/participants/:user_id', removeParticipantFromCalendarEvent);

module.exports = router;
