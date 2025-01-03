const express = require('express');
const router = express.Router();

const {
  createIntegration,
  getIntegrationsByUser,
  getIntegrationById,
  updateIntegration,
  deleteIntegration,
  searchIntegrations,
  getAllIntegrations,
} = require('../controller/integrationController');

// Routes for integration management
router.post('/', createIntegration);
router.get('/user/:user_id', getIntegrationsByUser);  // With pagination
router.get('/:integration_id', getIntegrationById);
router.put('/:integration_id', updateIntegration);
router.delete('/:integration_id', deleteIntegration);

// Additional routes
router.get('/', getAllIntegrations);  // With pagination
router.get('/search', searchIntegrations);  // With search and pagination

module.exports = router;
