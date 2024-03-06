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
router.patch('/updateNameSurnameGenre', authenticate, utilisateurController.updateNameSurnameGenre);
router.get('/rechercher/:id', authenticate, utilisateurController.findUser);

router.post('/forgot-password', utilisateurController.forgotPassword);
router.post('/check-reset-token', utilisateurController.checkResetToken);
router.post('/reset-password/:token', utilisateurController.resetPassword);
router.post('/resend-forgot-password-email/:email', utilisateurController.resendForgotPasswordEmail);
router.get('/profil/:id', authenticate, utilisateurController.getUserProfile);

const upload = require('../middleware/multerConfig');

// Update user profile picture route
router.post('/updateProfilePicture', authenticate, (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.status(400).json({ error: err });
    } else {
      if(req.file == undefined){
        res.status(400).json({ error: 'No file selected' });
      } else {
        // Here, you can now save the file path to the user's record in the database
        // Assuming you have a function updateUserPhoto in your controller
        const filePath = req.file.path;
        utilisateurController.updateUserPhoto(req, res, filePath);
      }
    }
  });
});

module.exports = router;
