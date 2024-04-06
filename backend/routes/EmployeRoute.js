const express = require('express');
const router = express.Router();
const employeController = require('../controllers/EmployeController');
const authenticate = require('../middleware/authenticate');

router.post('/demandes', authenticate, employeController.createDemande);
router.get('/isAdherant', authenticate, employeController.isAdherant);

module.exports = router;
