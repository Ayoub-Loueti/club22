const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'ayoub';
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const crypto = require("crypto");
const Utilisateur = require('../models/UtilisateurModel'); 
require("dotenv").config();

exports.signup = async (req, res) => {
    const { nom, prenom, email, motDePasse, genre, photo, type , etat} = req.body;
  
    try {
      const existingUser = await Utilisateur.findOne({ where: { email: email } });
  
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists' });
      } else {

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
        });
  
        const token = jwt.sign({ userId: newUser.id_utilisateur }, secretKey, {
          expiresIn: '1h',
        });
  
        res.status(201).json({
          message: 'User registered successfully',
          user: newUser,
          token: token,
        });
      }
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

        if (user.etat !== 'autorise') {
            return res.status(403).json({ error: 'User account is not authorized to log in' });
        }

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
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
      return res.status(403).json({ error: "vous pouvez pas recherche ton compte" });
    }

    const user = await Utilisateur.findOne({
      where: { id_utilisateur: requestedUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "utilisateur non trouvee" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const FROM_EMAIL = process.env.MAILER_EMAIL_ID;
const AUTH_PASSWORD = process.env.MAILER_PASSWORD;

const API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.DEVELOPMENT_API_URL;

const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: FROM_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

const {
  forgotPasswordEmailTemplate,
  resetPasswordConfirmationEmailTemplate,
} = require("../template/userAccountEmailTemplates");

exports.forgotPassword = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      throw new Error("Utilisateur not found.");
    }
    console.log(user);
    const token = Math.floor(1000 + Math.random() * 9000);

    await Utilisateur.update(
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(Date.now() + 3600000), // token expires in 1 hour
      },
      { where: { id_utilisateur: user.id_utilisateur } }
    );

    const template = forgotPasswordEmailTemplate(
      user.nom_prenom,
      user.email,
      API_ENDPOINT,
      token
    );

    const data = {
      from: FROM_EMAIL,
      to: user.email,
      subject: "Reinitialisation de votre mot de passe",
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
}

exports.checkResetToken = async (req, res) => {
  try {
    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        isValid: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    return res.json({ isValid: true });
  } catch (error) {
    return res.status(500).json({ isValid: false, message: error.message });
  }
}

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
        message: "Password reset token is invalid or has expired.",
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
      subject: "Confirmation de réinitialisation du mot de passe",
      html: template,
    };

    await smtpTransport.sendMail(data);

    return res.json({ message: "Réinitialisation du mot de passe" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = exports;