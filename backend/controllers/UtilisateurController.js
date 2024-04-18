const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'ayoub';
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const passport = require('passport');
const { Sequelize } = require('sequelize'); 
const { sequelize } = require('../config/db'); // Ensure this import is correct
const twilio = require('twilio');
const Client = require('../models/ClientModel');
const Offre = require('../models/OffreModel');
const Collaborateur = require('../models/CollaborateurModel');
const ImageOffre = require('../models/ImageOffreModel');
const crypto = require('crypto');
const Utilisateur = require('../models/UtilisateurModel');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { nom, prenom, email, motDePasse, genre, photo, type, etat } = req.body;

  try {
    const existingUser = await Utilisateur.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
    } else {
      const token = Math.floor(1000 + Math.random() * 9000);
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        genre,
        photo,
        type,
        etat,
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000),
        lockUntil:0,
      });

      // Send confirmation email
      const confirmationTemplate = signUpConfirmationEmailTemplate(
        newUser.nom,
        newUser.prenom,
        newUser.id_utilisateur,
        newUser.resetPasswordToken,
        API_ENDPOINT
      );
      const confirmationData = {
        from: FROM_EMAIL,
        to: newUser.email,
        subject: 'Confirmation de votre inscription',
        html: confirmationTemplate,
      };
      await smtpTransport.sendMail(confirmationData);

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { userId, token } = req.params;

    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        id_utilisateur: userId,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          'Invalid activation token or user ID, or the token has expired.',
      });
    }

    // Update the user's state to 'autorise'
    await Utilisateur.update(
      { etat: 'autorise' },
      { where: { id_utilisateur: userId } }
    );

    /*
    await Utilisateur.update(
      {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id_utilisateur: userId } }
    );
*/
    return res.json({ message: 'Compte activé avec succès.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.resendActivationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Utilisateur.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.etat === 'autorise') {
      return res.status(400).json({ message: 'User account is already activated.' });
    }

    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
    }, {
      where: { id_utilisateur: user.id_utilisateur }
    });

    const confirmationTemplate = signUpConfirmationEmailTemplate(
      user.nom,
      user.prenom,
      user.id_utilisateur,
      token,
      API_ENDPOINT // Make sure this endpoint points to where the user can confirm their email
    );

    const confirmationData = {
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Confirmation de votre inscription',
      html: confirmationTemplate,
    };

    await smtpTransport.sendMail(confirmationData);

    return res.status(200).json({ message: 'Activation email resent successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await Utilisateur.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    if (user.etat === 'bloque') {
      return res.status(403).json({
        error: 'Votre compte est bloqué. Veuillez contacter l’administrateur.',
      });
    }

    if (user.etat === 'En attente') {
      return res.status(403).json({ error: 'Le compte utilisateur n’est pas autorisé à se connecter.' });
    }

    const now = new Date();
    if (user.lockUntil && user.lockUntil > now) {
      return res.status(403).json({ error: 'Votre compte est temporairement bloqué. Veuillez réessayer plus tard.' });
    }

    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);

    if (passwordMatch) {
      await Utilisateur.update({ loginAttempts: 0, lockUntil: null }, { where: { email: email } });

      const token = jwt.sign({ userId: user.id_utilisateur }, secretKey, { expiresIn: '24h' });

      return res.status(200).json({
        message: 'Connexion réussie',
        user: user,
        token: token,
        shouldUpdateProfile: !user.nom || !user.prenom, // Simplified logic
      });
    } else {
      let updates = { loginAttempts: user.loginAttempts + 1 };
      if (updates.loginAttempts >= 3) {
        updates.loginAttempts = 0; // reset attempts
        updates.lockUntil = new Date(now.getTime() + 30 * 60 * 1000); // lock account for 30 minutes
      }

      await Utilisateur.update(updates, { where: { email: email } });

      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (error, user, info) => {
    if (error) {
      return next(error); // Handle error
    }
    if (!user) {
      return res.redirect('http://localhost:3000/signup'); // Handle "no user" scenario
    }

    // User is found or created successfully, now sign the JWT token with user's information
    const userToken = jwt.sign({ userId: user.id_utilisateur }, secretKey, {
      expiresIn: '24h', // Adjust token expiration as needed
    });

    // Redirect to the /load page with the token as a query parameter
    res.redirect(`http://localhost:3000/load?token=${userToken}&userId=${user.id_utilisateur}`);
  })(req, res, next); // Make sure to pass req, res, next to the inner function
};


exports.logout = (req, res) => {
  console.log('Logging out user');
  req.logout((err) => {
    if (err) {
      console.log('Logout error:', err);
      return next(err);
    }
    console.log('Session destruction started');
    req.session.destroy((err) => {
      if (err) {
        console.log('Session destruction error:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Session destroyed');
      res.clearCookie('connect.sid'); // Ensure this matches your session cookie's name
      return res.json({ message: 'You have been logged out' });
    });
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.userId;

  try {
    const userToUpdate = await Utilisateur.findByPk(userId);

    if (!userToUpdate) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await Utilisateur.update(req.body, {
      where: { id_utilisateur: userId },
    });

    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateNameSurnameGenre = async (req, res) => {
  const { nom, prenom, genre } = req.body;
  const userId = req.userId; // Assurez-vous d'avoir l'ID de l'utilisateur, par exemple, depuis un token JWT

  try {
    const user = await Utilisateur.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si le nom et le prénom sont vides
    if (!user.nom.trim() && !user.prenom.trim()) {
      await Utilisateur.update({ nom, prenom, genre }, { where: { id_utilisateur: userId } });
      res.status(200).json({ message: 'Nom, prénom et genre mis à jour avec succès.' });
    } else {
      // Nom ou prénom n'est pas vide
      res.status(400).json({ message: 'Le nom et le prénom doivent être vides pour permettre la mise à jour.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.findUser = async (req, res) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.userId;

  try {
    if (requestedUserId === authenticatedUserId.toString()) {
      return res
        .status(403)
        .json({ error: 'vous pouvez pas recherche ton compte' });
    }

    const user = await Utilisateur.findOne({
      where: { id_utilisateur: requestedUserId },
    });

    if (!user) {
      return res.status(404).json({ error: 'utilisateur non trouvee' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const FROM_EMAIL = process.env.MAILER_EMAIL_ID;
const AUTH_PASSWORD = process.env.MAILER_PASSWORD;

const API_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

const {
  signUpConfirmationEmailTemplate,
  forgotPasswordEmailTemplate,
  resetPasswordConfirmationEmailTemplate,
} = require('../template/userAccountEmailTemplates');

exports.forgotPassword = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Check if the user's account status is 'autorise'
    if (user.etat !== 'autorise') {
      return res.status(403).json({ message: 'Votre compte doit être autorisé pour réinitialiser le mot de passe.' });
    }

    // Check if user's password is empty, indicating they signed up through Google
    if (!user.motDePasse || user.motDePasse.trim() === '') {
      return res.status(400).json({ message: 'Les utilisateurs qui se sont inscrits via Google doivent utiliser la réinitialisation de mot de passe de Google.' });
    }

    console.log(user);
    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
    }, {
      where: { id_utilisateur: user.id_utilisateur }
    });

    const template = forgotPasswordEmailTemplate(user.nom, user.email, API_ENDPOINT, token);

    const data = {
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({
      message: "Veuillez vérifier votre e-mail pour plus d'instructions",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.checkResetToken = async (req, res) => {
  try {
    const { resetPasswordToken } = req.body;

    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        isValid: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    return res.json({ isValid: true });
  } catch (error) {
    return res.status(500).json({ isValid: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.',
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    await Utilisateur.update(
      {
        motDePasse: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { where: { id_utilisateur: user.id_utilisateur } }
    );

    const template = resetPasswordConfirmationEmailTemplate(user.nom);
    const data = {
      to: user.email,
      from: FROM_EMAIL,
      subject: 'Confirmation de réinitialisation du mot de passe',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({ message: 'Réinitialisation du mot de passe' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resendForgotPasswordEmail = async (req, res) => {
  // Extract the email from URL parameters instead of the body
  const { email } = req.params;

  try {
    const user = await Utilisateur.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
    }, {
      where: { id_utilisateur: user.id_utilisateur }
    });

    const template = forgotPasswordEmailTemplate(user.nom, user.email, API_ENDPOINT, token);
    const data = {
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - Renvoi',
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({
      message: "E-mail de réinitialisation du mot de passe renvoyé avec succès. Veuillez vérifier votre e-mail pour plus d'instructions",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    const user = await Utilisateur.findByPk(userId, {
      attributes: { exclude: ['motDePasse'] }, // Exclude the password for security reasons
    });

    if (user) {
      res.status(200).json({ message: 'User profile retrieved successfully', user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Add to utilisateurController.js
exports.updateUserPhoto = async (req, res, filePath) => {
  const userId = req.userId; // Make sure you have the user's ID available, e.g., from a JWT token

  try {
    await Utilisateur.update({ photo: filePath }, { where: { id_utilisateur: userId } });
    res.status(200).json({ message: 'Profile picture updated successfully', filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRandomUsers = async (req, res) => {
  try {
      let whereCondition = {
          etat: 'autorise', // Ensure only users with 'etat' as 'autorise' are selected
      };
      
      // Check if the user is authenticated (req.userId is set by your authentication middleware)
      if (req.userId) {
          // Exclude the current user from the results and ensure 'etat' is 'autorise'
          whereCondition = {
              [Sequelize.Op.and]: [
                  { id_utilisateur: { [Sequelize.Op.ne]: req.userId } },
                  { etat: 'autorise' }
              ]
          };
      }

      const users = await Utilisateur.findAll({
          where: whereCondition,
          limit: 100 // Adjust the sample size as needed
      });

      // Shuffle the array to get random elements
      const shuffledUsers = users.sort(() => 0.5 - Math.random());
      
      // Slice the first 7 elements from the shuffled array
      const randomUsers = shuffledUsers.slice(0, 7);

      if (randomUsers.length === 0) {
          return res.status(404).json({ message: 'No users found' });
      }

      return res.status(200).json(randomUsers);
  } catch (error) {
      console.error('Error fetching random users:', error);
      return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


exports.deleteProfilePicture = async (req, res) => {
  const userId = req.userId; // Assuming you have middleware that sets req.userId from the token

  try {
    const user = await Utilisateur.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.photo) {
      return res.status(400).json({ message: 'No profile picture to delete' });
    }

    // Add logic here to delete the profile picture file from the server
    // For example, use fs.unlink if storing files directly on the server

    user.photo = null; // Remove the profile picture reference
    await user.save();

    res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return res.status(500).json({
      message: 'Error deleting profile picture',
      error: error.message,
    });
  }
};

exports.findUsersBySubstring = async (req, res) => {
  const substring = req.query.substring || '';
  const currentUserId = req.userId; // Assuming this is how you get the current user's ID

  try {
    const userPromise = Utilisateur.findAll({
      where: {
        [Op.and]: [
          { id_utilisateur: { [Op.ne]: currentUserId } },
          { etat: 'autorise' },
          Sequelize.where(Sequelize.fn('concat', Sequelize.col('nom'), ' ', Sequelize.col('prenom')), {
            [Op.like]: `%${substring}%` // Use Op.like for case-insensitive search
          })
        ],
      },
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo'],
    });

    const offerPromise = Offre.findAll({
      where: {
        [Op.or]: [
          { titre: { [Op.like]: `%${substring}%` } },
        ],
      },
      attributes: ['id_offre', 'titre', 'description', 'prix', 'remise', 'type'],
    });

    const collabPromise = Collaborateur.findAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${substring}%` } },
         
        ],
      },
      attributes: ['id_collaborateur', 'nom', 'logo']
    });

    const [users, offers, collaborators] = await Promise.all([userPromise, offerPromise, collabPromise]);

    // Fetch images for each offer and map them
    const offersWithImages = await Promise.all(offers.map(async (offer) => {
      const images = await ImageOffre.findAll({
        where: { id_offre: offer.id_offre },
        attributes: ['image']
      });
      return { ...offer.dataValues, images: images.map(img => img.image) };
    }));

    if (users.length === 0 && offers.length === 0 && collaborators.length === 0) {
      return res.status(200).json({ message: 'No users, offers, or collaborators found matching your search.' });
    }

    return res.status(200).json({ users, offers: offersWithImages, collaborators });
  } catch (error) {
    console.error('Error fetching users and offers by substring:', error);
    return res.status(500).json({ message: 'Error fetching users and offers', error: error.message });
  }
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

exports.sendSMS = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const userId = req.userId;
    const user = await Client.findOne({
      where: {
        id_utilisateur: userId
      },
      include: [{
        model: Utilisateur,
        as: 'utilisateur'
      }],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    if (user.points <= 0) {
      return res.status(403).json({ message: 'Vous n\'avez pas assez de points pour envoyer un SMS.' });
    }

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toLocaleDateString('fr-FR', { // Assuming you want the date in French format
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const messageBody = `Bonjour ${user.utilisateur.nom} ${user.utilisateur.prenom}, vous avez ${user.points} points valable jusqu'au ${dateString}`;

    const messageResponse = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    if (messageResponse.sid) {
      await Client.update({ points: 0 }, { where: { id_utilisateur: userId } });
      return res.status(200).json({ message: 'SMS envoyé avec succès. Vos points ont été réinitialisés.' });
    } else {
      return res.status(500).json({ message: 'Échec de l\'envoi du SMS.' });
    }
  } catch (error) {
    console.error('Error in sendSMS:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getPoints = async (req, res) => {
  const id_utilisateur = req.userId; // Assuming user ID is retrieved from authentication middleware

  try {
    // Find the client record for the user ID
    const client = await Client.findOne({ where: { id_utilisateur } });

    if (client) {
      // If client record exists, send the points in the response
      res.status(200).json({ points: client.points });
    } else {
      // If client record does not exist, send an appropriate message
      res.status(200).json({ message: 'Points not found for this user' });
    }
  } catch (error) {
    // If an error occurs, send a 500 status response with the error message
    res.status(500).json({ message: 'Error retrieving points', error: error.message });
  }
};

module.exports = exports;
