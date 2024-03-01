const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'ayoub';
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const passport = require('passport');

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
      return res.status(404).json({ error: 'User not found' });
    }

    const activationToken = Math.floor(1000 + Math.random() * 9000);

    user.resetPasswordToken = activationToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();

    const confirmationTemplate = signUpConfirmationEmailTemplate(
      user.nom,
      user.prenom,
      user.id_utilisateur,
      user.resetPasswordToken,
      API_ENDPOINT
    );
    const confirmationData = {
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Confirmation de votre inscription',
      html: confirmationTemplate,
    };
    await smtpTransport.sendMail(confirmationData);

    res.status(200).json({ message: 'Activation email resent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await Utilisateur.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: 'utilisateur non trouvee' });
    }

    if (user.etat === 'bloque') {
      return res.status(403).json({
        error: 'Your account is blocked. Please contact the administrator.',
      });
    }

    if (user.etat === 'attend') {
      return res
        .status(403)
        .json({ error: 'User account is not authorized to log in' });
    }

    const hasNameAndSurname = user.nom;
    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user.id_utilisateur }, secretKey, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      user: user,
      token: token,
      shouldUpdateProfile: !hasNameAndSurname,
    });
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
      expiresIn: '1h', // Adjust token expiration as needed
    });

    // Redirect to the /load page with the token as a query parameter
    res.redirect(`http://localhost:3000/load?token=${userToken}`);
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
      throw new Error('Utilisateur non trouvé.');
    }
    console.log(user);
    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update(
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      },
      { where: { id_utilisateur: user.id_utilisateur } }
    );

    const template = forgotPasswordEmailTemplate(
      user.nom,
      user.email,
      API_ENDPOINT,
      token
    );

    const data = {
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Reinitialisation de votre mot de passe',
      html: template,
    };
    // Assuming smtpTransport is properly configured and defined
    await smtpTransport.sendMail(data);

    return res.json({
      message: "Veuillez vérifier votre e-mail pour plus d'instructions",
    });
  } catch (error) {
    return res.status(422).json({ message: error.message });
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

module.exports = exports;
