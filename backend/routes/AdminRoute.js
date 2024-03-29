const express = require('express');
const adminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.put('/block/:id', authenticate, adminController.updateUserEtat);

router.put(
  '/unblock/:id',
  authenticate,
  adminController.updateUserEtatAutorise
);

router.get('/listCli', authenticate, adminController.getAllClients);

// router.get('/bloquecli', authenticate, adminController.getAllBlockedUsers);

router.get('/listEmp', authenticate, adminController.getAllEmploye);

// router.get('/bloqueEmp', authenticate, adminController.getAllBlockedEmploye);

router.get('/allUsers', authenticate, adminController.getAllUsers);

//collab et offre
router.post('/collaborator', authenticate, adminController.createCollaborateur);

router.put('/collaborateur/:collabId/archiver', authenticate, adminController.archiveCollab);

router.put('/collaborateur/:collabId/desarchiver', authenticate, adminController.desarchiveCollab);

//router.delete('/collaborator/:collaboratorId', authenticate, adminController.deleteCollaborateur);

router.get('/allCollaborators',authenticate,adminController.getAllCollaborateurs);

router.get('/collaborator/:collaboratorId',authenticate,adminController.getCollaborateurById);

router.put('/collaborator/:collaboratorId',authenticate,adminController.updateCollaborateur);

router.post('/offer', authenticate, adminController.createOffre);

router.put('/offer/:offreId', authenticate, adminController.updateOffre);

router.delete('/offer/:offreId', authenticate, adminController.deleteOffre);

router.get('/allOffers', authenticate, adminController.getAllOffres);

router.get('/offer/:offreId', authenticate, adminController.getOffreById);

router.put('/employes/:employeId/adherant', authenticate, adminController.updateEmployeAdherant);

router.put('/employes/:employeId/nonAdherant', authenticate, adminController.updateEmployeNonAdherant);

module.exports = router;
