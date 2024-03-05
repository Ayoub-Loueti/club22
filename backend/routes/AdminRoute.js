const express = require('express');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.put('/block/:id', authenticate, adminController.updateUserEtat);

router.put('/unblock/:id', authenticate, adminController.updateUserEtatAutorise);

router.get('/listCli',authenticate, adminController.getAllClients);

// router.get('/bloquecli', authenticate, adminController.getAllBlockedUsers);

router.get('/listEmp',authenticate, adminController.getAllEmploye);

// router.get('/bloqueEmp', authenticate, adminController.getAllBlockedEmploye);

router.get('/allUsers', authenticate, adminController.getAllUsers);

module.exports = router;