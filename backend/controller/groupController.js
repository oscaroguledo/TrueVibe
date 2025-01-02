const { Group, validateGroup } = require('../models/groupModel');
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const User = require('../models/userModel'); // Assuming user model exists

// Controller for creating a new group

const createGroup = async (req, res) => {
  try {
    // Validate the request body
    const { error, value } = validateGroup(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create a new group from the validated data
    const group = new Group(value);

    // Save the group to the database
    await group.save();

    return res.status(201).json(generateDefaultResponseObject({
      message: 'Group created successfully',
      group,
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateDefaultResponseObject({ message: 'Server error' }));
  }
};

// Controller for fetching all groups
const getAllGroups = async (req, res) => {
    try {
      // Fetch all groups from the database
      const groups = await Group.find()
        .populate('group_admins', 'full_name username') // Optional: Populate admin details
        .populate('employees', 'full_name username'); // Optional: Populate employee details
  
      return res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Controller for fetching a group by its ID
const getGroupById = async (req, res) => {
    try {
      const { group_id } = req.params;
  
      // Fetch the group from the database by ID
      const group = await Group.findOne({ group_id })
        .populate('group_admins', 'full_name username')
        .populate('employees', 'full_name username');
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json(group);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
// Controller for updating group details
const updateGroup = async (req, res) => {
    try {
      const { group_id } = req.params;
      const { error, value } = validateGroup(req.body);
  
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      // Find and update the group by its group_id
      const updatedGroup = await Group.findOneAndUpdate({ group_id }, value, { new: true });
  
      if (!updatedGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Group updated successfully',
        group: updatedGroup,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  // Controller for deleting a group
const deleteGroup = async (req, res) => {
    try {
      const { group_id } = req.params;
  
      // Find and delete the group by its group_id
      const deletedGroup = await Group.findOneAndDelete({ group_id });
  
      if (!deletedGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Group deleted successfully',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
// Controller to add an employee to a group
const addEmployeeToGroup = async (req, res) => {
    try {
      const { group_id, user_id } = req.params;
  
      // Check if the user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the user to the group
      const group = await Group.findOneAndUpdate(
        { group_id },
        { $addToSet: { employees: user._id } }, // $addToSet avoids duplicate entries
        { new: true }
      );
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Employee added to group successfully',
        group,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Controller to remove an employee from a group
const removeEmployeeFromGroup = async (req, res) => {
    try {
      const { group_id, user_id } = req.params;
  
      // Remove the user from the group
      const group = await Group.findOneAndUpdate(
        { group_id },
        { $pull: { employees: user_id } }, // $pull removes the user from the employees array
        { new: true }
      );
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Employee removed from group successfully',
        group,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

// Controller to add an admin to a group
const addAdminToGroup = async (req, res) => {
    try {
      const { group_id, user_id } = req.params;
  
      // Check if the user exists and is not already an admin
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the user to the group admins array
      const group = await Group.findOneAndUpdate(
        { group_id },
        { $addToSet: { group_admins: user._id } },
        { new: true }
      );
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Admin added to group successfully',
        group,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
// Controller to remove an admin from a group
const removeAdminFromGroup = async (req, res) => {
    try {
      const { group_id, user_id } = req.params;
  
      // Remove the user from the group admins array
      const group = await Group.findOneAndUpdate(
        { group_id },
        { $pull: { group_admins: user_id } }, // $pull removes the user from group_admins
        { new: true }
      );
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      return res.status(200).json({
        message: 'Admin removed from group successfully',
        group,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
module.exports = { createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    addEmployeeToGroup,
    removeEmployeeFromGroup,
    addAdminToGroup, removeAdminFromGroup };
