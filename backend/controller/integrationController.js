const { Integration } = require('../models/integrationModel');
const { paginate } = require('../utils/paginationUtil');  // Pagination utility
const { User } = require('../models/userModel');
const { logAuditAction } = require('../utils/logAuditAction');

const createIntegration = async (req, res) => {
  try {
    const { integration_name, integration_type, user_id, integration_config } = req.body;

    // Validate if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the new integration
    const newIntegration = new Integration({
      integration_name,
      integration_type,
      user_id,
      integration_config,
    });

    await newIntegration.save();
    
    // Log the action in the background
    await logAuditAction(
      user_id,
      'create',
      `Created an Integration: ${newIntegration._id}`,
      { newIntegration_id: newIntegration._id}
    );
 
    return res.status(201).json({
      message: 'Integration created successfully',
      integration: newIntegration,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getIntegrationsByUser = async (req, res) => {
    try {
      const { user_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
  
      // Use the pagination utility
      const { data: integrations, pagination } = await paginate(Integration, { user_id }, page, limit);
  
      if (integrations.length === 0) {
        return res.status(404).json({ message: 'No integrations found for this user' });
      }
  
      return res.status(200).json({
        message: 'Integrations retrieved successfully',
        integrations,
        pagination,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
const getAllIntegrations = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
  
      // Use the pagination utility
      const { data: integrations, pagination } = await paginate(Integration, {}, page, limit);
  
      if (integrations.length === 0) {
        return res.status(404).json({ message: 'No integrations found' });
      }
  
      return res.status(200).json({
        message: 'All integrations retrieved successfully',
        integrations,
        pagination,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

const getIntegrationById = async (req, res) => {
    try {
      const { integration_id } = req.params;
  
      const integration = await Integration.findById(integration_id);
      if (!integration) {
        return res.status(404).json({ message: 'Integration not found' });
      }
  
      return res.status(200).json({
        integration,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };

const updateIntegration = async (req, res) => {
    try {
      const { integration_id } = req.params;
      const { integration_name, integration_type, integration_config, status } = req.body;
  
      // Find the integration
      const integration = await Integration.findById(integration_id);
      if (!integration) {
        return res.status(404).json({ message: 'Integration not found' });
      }
  
      // Update the integration fields
      integration.integration_name = integration_name || integration.integration_name;
      integration.integration_type = integration_type || integration.integration_type;
      integration.integration_config = integration_config || integration.integration_config;
      integration.status = status || integration.status;
  
      await integration.save();
      
      // Log the action in the background
      await logAuditAction(
        user_id,
        'update',
        `Updated an Integration: ${integration._id}`,
        { integration_id: integration._id}
      );
 
      return res.status(200).json({
        message: 'Integration updated successfully',
        integration,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
const deleteIntegration = async (req, res) => {
    try {
      const { integration_id } = req.params;
  
      // Find the integration to delete
      const integration = await Integration.findById(integration_id);
      if (!integration) {
        return res.status(404).json({ message: 'Integration not found' });
      }
  
      // Delete the integration
      await integration.remove();
          
      // Log the action in the background
      await logAuditAction(
        user_id,
        'delete',
        `Deleted an Integration: ${integration._id}`,
        { integration_id: integration._id}
      );
 
      return res.status(200).json({
        message: 'Integration deleted successfully',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
const searchIntegrations = async (req, res) => {
  try {
    const { query } = req.query;
    const { page = 1, limit = 10 } = req.query;

    // Search integrations by name or config, with pagination
    const { data: integrations, pagination } = await paginate(Integration, {
      integration_name: { $regex: query, $options: 'i' },
    }, page, limit);

    if (integrations.length === 0) {
      return res.status(404).json({ message: 'No integrations found' });
    }

    return res.status(200).json({
      integrations,
      pagination,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
    createIntegration,
    getIntegrationsByUser,
    getIntegrationById,
    updateIntegration,
    deleteIntegration,
    searchIntegrations,
    getAllIntegrations
  };
  