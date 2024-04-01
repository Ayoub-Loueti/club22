const express = require('express');
const collaborateurController = require('../controllers/CollaborateurController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/collaborator', authenticate, collaborateurController.createCollaborateur);
router.put('/collaborateur/:collabId/archiver', authenticate, collaborateurController.archiveCollab);
router.put('/collaborateur/:collabId/desarchiver', authenticate, collaborateurController.desarchiveCollab);
//router.delete('/collaborator/:collaboratorId', authenticate, collaborateurController.deleteCollaborateur);
router.get('/allCollaborators',authenticate,collaborateurController.getAllCollaborateurs);
router.get('/allCollaborateursAD',authenticate,collaborateurController.getAllCollaborateursAD);
router.get('/collaborator/:collaboratorId',authenticate,collaborateurController.getCollaborateurById);
router.put('/collaborator/:collaboratorId',authenticate,collaborateurController.updateCollaborateur);
router.get('/allCollaborateursEmploye',authenticate,collaborateurController.getAllCollaborateursEmploye);

module.exports = router;
