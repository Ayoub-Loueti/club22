const express = require('express');
const router = express.Router();
const employeController = require('../controllers/EmployeController');
const authenticate = require('../middleware/authenticate');

router.post('/demandes', authenticate, employeController.createDemande);
router.get('/isAdherant', authenticate, employeController.isAdherant);


 // Route pour créer une réclamation
   router.post(
     '/reclamations',
     authenticate,
     employeController.createReclamation
   );

   // Route pour récupérer les réclamations par employé
   router.get(
     '/reclamations/:id_employe',
     authenticate,
     employeController.getReclamationsByEmploye
   );
router.get('/details', authenticate, employeController.getEmployeDetails);
module.exports = router;
