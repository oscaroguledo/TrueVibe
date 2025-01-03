const express = require('express');
const router = express.Router();
const {
  createOrUpdateUserSetting,
  getUserSettings,
  getUserSettingByName,
  deleteUserSetting,
  deleteAllUserSettings,
} = require('../controller/userSettingsController');

// Create or Update a User Setting
router.post('/', createOrUpdateUserSetting);

// Get All User Settings with Pagination (for a specific user)
router.get('/', getUserSettings);

// Get Specific User Setting by Name (for a specific user)
router.get('/:user_id/:setting_name', getUserSettingByName);

// Delete Specific User Setting (for a specific user)
router.delete('/:user_id/:setting_name', deleteUserSetting);

// Delete All User Settings (for a specific user)
router.delete('/:user_id', deleteAllUserSettings);

module.exports = router;
