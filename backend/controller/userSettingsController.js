const { UserSetting } = require('../models/userSettingsModel');
const { paginate } = require('../utils/paginationUtil');
const { logAuditAction } = require('../utils/logAuditAction');

// Create or Update User Setting
const createOrUpdateUserSetting = async (req, res) => {
  try {
    const { user_id, setting_name, setting_value } = req.body;

    let userSetting = await UserSetting.findOne({ user_id, setting_name });

    if (userSetting) {
        userSetting.setting_value = setting_value;
        userSetting.updated_at = Date.now();
        await userSetting.save();

        // Log the action in the background
        await logAuditAction(
            user_id,
            'update',
            `Updated a User Setting: ${userSetting._id}`,
            { userSetting_id: userSetting._id }
        );

        return res.status(200).json({
            message: 'User setting updated successfully',
            userSetting,
        });
    } else {
        userSetting = new UserSetting({
            user_id,
            setting_name,
            setting_value,
        });
        await userSetting.save();

        // Log the action in the background
        await logAuditAction(
            user_id,
            'create',
            `Created a User Setting: ${userSetting._id}`,
            { userSetting_id: userSetting._id}
        );

        return res.status(201).json({
            message: 'User setting created successfully',
            userSetting,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get User Settings with Pagination
const getUserSettings = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;

    const { data, pagination } = await paginate(UserSetting, { user_id }, page, limit);

    return res.status(200).json({
      message: 'User settings retrieved successfully',
      settings: data,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Specific User Setting by Name
const getUserSettingByName = async (req, res) => {
  try {
    const { user_id, setting_name } = req.params;

    const userSetting = await UserSetting.findOne({ user_id, setting_name });

    if (!userSetting) {
      return res.status(404).json({ message: 'User setting not found' });
    }

    return res.status(200).json({ userSetting });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete Specific User Setting
const deleteUserSetting = async (req, res) => {
  try {
    const { user_id, setting_name } = req.params;

    const userSetting = await UserSetting.findOneAndDelete({ user_id, setting_name });

    if (!userSetting) {
      return res.status(404).json({ message: 'User setting not found' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted a User Setting: ${userSetting._id}`,
      { setting_id: userSetting._id}
    );

    return res.status(200).json({ message: 'User setting deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete All User Settings for a User
const deleteAllUserSettings = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await UserSetting.deleteMany({ user_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No settings found for this user' });
    }

    // Log the action in the background
    await logAuditAction(
      user_id,
      'delete',
      `Deleted all User Settings: ${result._id}`,
      { user_id: user_id, userSetting_id:result._id }
    );

    return res.status(200).json({ message: 'All user settings deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateUserSetting,
  getUserSettings,
  getUserSettingByName,
  deleteUserSetting,
  deleteAllUserSettings,
};
