const express = require('express');
const router = express.Router();
const employeController = require('../controllers/EmployeController');
const authenticate = require('../middleware/authenticate');



module.exports = router;
