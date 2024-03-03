const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController.js');
const authenticate = require('../middleware/authenticate.js');

router.post('/signup', utilisateurController.signup);
router.get('/activateAccount/:userId/:token',utilisateurController.activateAccount);
router.post('/resendEmail', utilisateurController.resendActivationEmail);

router.post('/login', utilisateurController.login);
router.get('/auth/google', utilisateurController.googleAuth);
router.get('/auth/google/callback', utilisateurController.googleAuthCallback);

router.get('/auth/logout', utilisateurController.logout);

router.put('/updateCompte', authenticate, utilisateurController.updateUser);
router.get('/rechercher/:id', authenticate, utilisateurController.findUser);

router.post('/forgot-password', utilisateurController.forgotPassword);
router.post('/check-reset-token', utilisateurController.checkResetToken);
router.post('/reset-password/:token', utilisateurController.resetPassword);
router.post('/resend-forgot-password-email/:email', utilisateurController.resendForgotPasswordEmail);
router.get('/profil', authenticate, utilisateurController.getUserProfile);

module.exports = router;
