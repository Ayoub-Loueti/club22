const express = require('express');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.put('/block/:id', authenticate, adminController.updateUserEtat);
router.put('/unblock/:id',authenticate,adminController.updateUserEtatAutorise);
router.get('/listCli', authenticate, adminController.getAllClients);
router.get('/listEmp', authenticate, adminController.getAllEmploye);
router.get('/allUsers', authenticate, adminController.getAllUsers);

// router.get('/bloquecli', authenticate, adminController.getAllBlockedUsers);
// router.get('/bloqueEmp', authenticate, adminController.getAllBlockedEmploye);

router.put('/employes/:employeId/adherant', authenticate, adminController.updateEmployeAdherant);
router.put('/employes/:employeId/nonAdherant', authenticate, adminController.updateEmployeNonAdherant);

module.exports = router;
