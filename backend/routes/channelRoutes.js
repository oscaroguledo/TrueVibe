const express = require('express');
const router = express.Router();
const {isChannelAdmin} = require('../middleware/validateuserStatus');
// Controllers
const {
  createChannel,
  addMemberToChannel,
  removeMemberFromChannel,
  getAllMembersInChannel,
  getChannelsByGroup,
  getChannelDetails,
  updateChannel,
  archiveChannel,
  reactivateChannel,
  searchChannels,
  getChannelRoles,
  updateChannelMemberRole,
} = require('../controllers/channelController');

// Routes

// 1. Create a channel
router.post('/channels', createChannel);

// 2. Add user to channel
router.post('/channels/:channel_id/members', addMemberToChannel);

// 3. Remove user from channel
router.delete('/channels/:channel_id/members/:user_id', removeMemberFromChannel);

// 4. Get all members in a channel
router.get('/channels/:channel_id/members', getAllMembersInChannel);

// 5. Get all channels in a group
router.get('/groups/:group_id/channels', getChannelsByGroup);

// 6. Get a specific channel's details
router.get('/channels/:channel_id', getChannelDetails);

// 7. Update a channel's details (e.g., name, type, status)
router.patch('/channels/:channel_id', updateChannel);

// 8. Archive a channel
router.patch('/channels/:channel_id/archive', archiveChannel);

// 9. Reactivate a channel
router.patch('/channels/:channel_id/reactivate', reactivateChannel);

// 10. Search channels by name
router.get('/channels/search', searchChannels);

// 11. Get all roles (members and admins) in a channel
router.get('/channels/:channel_id/roles', getChannelRoles);

// 12. Update a user's role in a channel (admin/member)

router.patch('/channels/:channel_id/members/:user_id', isChannelAdmin, updateChannelMemberRole);

module.exports = router;
