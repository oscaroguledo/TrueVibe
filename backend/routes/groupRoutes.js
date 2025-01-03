const express = require('express');
const router = express.Router();

// Import Group controllers
const {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addEmployeeToGroup,
  removeEmployeeFromGroup,
  addAdminToGroup,
  removeAdminFromGroup
} = require('../controller/groupController');

// **Group Operations**
router.post('/', createGroup); // Create a new group
router.get('/', getAllGroups); // Get all groups
router.get('/:group_id', getGroupById); // Get a group by its ID
router.put('/:group_id', updateGroup); // Update group details
router.delete('/:group_id', deleteGroup); // Delete a group

// **Employee Management in Groups**
router.post('/:group_id/employee/:user_id', addEmployeeToGroup); // Add employee to group
router.delete('/:group_id/employee/:user_id', removeEmployeeFromGroup); // Remove employee from group

// **Admin Management in Groups**
router.post('/:group_id/admin/:user_id', addAdminToGroup); // Add admin to group
router.delete('/:group_id/admin/:user_id', removeAdminFromGroup); // Remove admin from group

module.exports = router;
