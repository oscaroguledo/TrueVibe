const { Channel,validateChannel } = require('../models/channel/channelModel');
const { User } = require('../models/User');
const { Group } = require('../models/Group');
const { ChannelMember,validateChannelMember } = require('../models/channel/channelMember');
const { logAuditAction } = require('../utils/logAuditAction');


const createChannel = async (req, res) => {
  try {
    // Validate the input data
    const { error, value } = validateChannel(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the group exists
    const group = await Group.findById(value.group_id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user (owner) exists
    const owner = await User.findById(value.owner_id);
    if (!owner) {
      return res.status(404).json({ message: 'User not found for the owner ID' });
    }

    // Create the new channel
    const channel = new Channel(value);
    await channel.save();

    // Log the channel creation action
    await logAuditAction(
      req.user.user_id,
      'create',
      `Created a new channel: ${channel.channel_name}`,
      { channel_id: channel._id, group_id: value.group_id, owner_id: value.owner_id }
    );

    // Add the owner as a member of the channel (they are both admin and member)
    const memberData = {
      channel_id: channel.channel_id,
      user_id: owner.user_id,
      role: 'admin', // The owner is the admin
    };

    // Validate the channel member
    const { error: memberError } = validateChannelMember(memberData);
    if (memberError) {
      return res.status(400).json({ message: memberError.details[0].message });
    }

    // Create a new channel member entry
    const channelMember = new ChannelMember(memberData);
    await channelMember.save();

    // Return success response
    return res.status(201).json({
      message: 'Channel created successfully and user added as admin and member',
      channel,
      owner,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
const addMemberToChannel = async (req, res) => {
    try {
      const { channel_id, user_id, role } = req.body;
  
      // Validate the input data
      const { error, value } = validateChannelMember({ channel_id, user_id, role });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // Check if the channel exists
      const channel = await Channel.findOne({ channel_id });
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
  
      // Check if the user exists
      const user = await User.findById(value.user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the user as a member of the channel
      const channelMember = new ChannelMember({
        channel_id: value.channel_id,
        user_id: value.user_id,
        role: value.role,
      });
  
      await channelMember.save();
      // Log the action of adding a member to the channel
      await logAuditAction(
        req.user.user_id,
        'create',
        `Added user ${user.full_name} as ${role} to channel ${channel.channel_name}`,
        { channel_id: channel._id, user_id: user._id, role }
      );
      return res.status(201).json({ message: 'User added as member', channelMember });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
const removeMemberFromChannel = async (req, res) => {
    try {
      const { channel_id, user_id } = req.params;
  
      const channel = await Channel.findOne({ channel_id });
      if (!channel) return res.status(404).json({ message: 'Channel not found' });
  
      const member = await ChannelMember.findOneAndDelete({ channel_id, user_id });
      if (!member) return res.status(404).json({ message: 'User not found in the channel' });
      await logAuditAction(
        req.user.user_id,
        'delete',
        `Removed user ${user.full_name} from channel ${channel.channel_name}`,
        { channel_id: channel._id, user_id: user._id }
      );
      return res.status(200).json({ message: 'User removed from channel successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
// Get all members in a channel with pagination
const getAllMembersInChannel = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for channel members
    const { data: members, pagination } = await paginate(ChannelMember, { channel_id }, page, limit);

    if (members.length === 0) {
      return res.status(404).json({ message: 'No members found for this channel' });
    }

    return res.status(200).json({
      members,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
      
// Get all channels by group with pagination
const getChannelsByGroup = async (req, res) => {
  try {
    const { group_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for channels in a group
    const { data: channels, pagination } = await paginate(Channel, { group_id }, page, limit);

    if (channels.length === 0) {
      return res.status(404).json({ message: 'No channels found for this group' });
    }

    return res.status(200).json({
      channels,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getChannelDetails = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const channel = await Channel.findOne({ channel_id });

    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    return res.status(200).json({ channel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateChannel = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const { channel_name, channel_type, status } = req.body;

    const channel = await Channel.findOne({ channel_id });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    channel.channel_name = channel_name || channel.channel_name;
    channel.channel_type = channel_type || channel.channel_type;
    channel.status = status || channel.status;
    channel.updated_at = Date.now();

    await channel.save();

    // Log the update action
    await logAuditAction(
      req.user.user_id,
      'update',
      `Updated channel ${channel.channel_name}`,
      { channel_id: channel._id, old_data: oldChannelData, new_data: channel }
    );

    return res.status(200).json({ message: 'Channel updated successfully', channel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const archiveChannel = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const channel = await Channel.findOne({ channel_id });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    channel.status = 'archived';
    channel.updated_at = Date.now();
    await channel.save();
    // Log the archiving action
    await logAuditAction(
      req.user.user_id,
      'update',
      `Archived channel ${channel.channel_name}`,
      { channel_id: channel._id, old_status: oldChannelStatus, new_status: 'archived' }
    );
    return res.status(200).json({ message: 'Channel archived successfully', channel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const reactivateChannel = async (req, res) => {
    try {
      const { channel_id } = req.params;
      const channel = await Channel.findOne({ channel_id });
      if (!channel) return res.status(404).json({ message: 'Channel not found' });
  
      channel.status = 'active';
      channel.updated_at = Date.now();
      await channel.save();
      // Log the reactivation action
      await logAuditAction(
        req.user.user_id,
        'update',
        `Reactivated channel ${channel.channel_name}`,
        { channel_id: channel._id, old_status: oldChannelStatus, new_status: 'active' }
      );
      return res.status(200).json({ message: 'Channel reactivated successfully', channel });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Search channels with pagination
const searchChannels = async (req, res) => {
  try {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for channel search
    const { data: channels, pagination } = await paginate(Channel, {
      channel_name: { $regex: query, $options: 'i' },
    }, page, limit);

    if (channels.length === 0) {
      return res.status(404).json({ message: 'No channels found' });
    }

    return res.status(200).json({
      channels,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get channel roles with pagination
const getChannelRoles = async (req, res) => {
  try {
    const { channel_id } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

    // Use the paginate utility for channel roles
    const { data: members, pagination } = await paginate(ChannelMember, { channel_id }, page, limit);

    if (members.length === 0) {
      return res.status(404).json({ message: 'No members found for this channel' });
    }

    return res.status(200).json({
      roles: members,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateChannelMemberRole = async (req, res) => {
    try {
      const { channel_id, user_id } = req.params;
      const { role } = req.body;  // Role should be 'admin' or 'member'
  
      // Validate role input
      if (!['admin', 'member'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be "admin" or "member".' });
      }
  
      // Find the channel
      const channel = await Channel.findOne({ channel_id });
      if (!channel) return res.status(404).json({ message: 'Channel not found' });
  
      // Find the member in the channel
      const member = await ChannelMember.findOne({ channel_id, user_id });
      if (!member) return res.status(404).json({ message: 'User not found in the channel' });
  
      // Check if the requesting user is an admin of the channel
      const currentUser = req.user; // Assuming the authenticated user is available in `req.user`
      const currentUserMembership = await ChannelMember.findOne({ channel_id, user_id: currentUser.user_id });
      
      if (currentUserMembership.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can update roles in this channel' });
      }
  
      // Update the member's role
      const oldRole = member.role;
      member.role = role;
      member.updated_at = Date.now();
  
      // Save the updated member data
      await member.save();
      // Log the role update action
      await logAuditAction(
        req.user.user_id,
        'update',
        `Updated user ${user_id} role from ${oldRole} to ${role} in channel ${channel.channel_name}`,
        { channel_id: channel._id, user_id, old_role: oldRole, new_role: role }
      );
      return res.status(200).json({
        message: `User role updated to ${role} successfully`,
        member,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
              
module.exports = { 
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
    updateChannelMemberRole
 };
