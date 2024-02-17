const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController.js');
const authenticate = require('../middleware/authenticate.js');

router.post('/signup', utilisateurController.signup);
router.post('/login', utilisateurController.login);

router.put('/updateCompte', authenticate, utilisateurController.updateUser);
router.get('/rechercher/:id', authenticate, utilisateurController.findUser);

module.exports = router;