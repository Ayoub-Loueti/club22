const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Utilisateur = require('./models/UtilisateurModel');
require('dotenv').config();
const {loginSuccessEmailTemplate} = require("./template/userAccountEmailTemplates");
const nodemailer = require("nodemailer");
require("dotenv").config();

const FROM_EMAIL = process.env.MAILER_EMAIL_ID;
const AUTH_PASSWORD = process.env.MAILER_PASSWORD;

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      try {
        let user = await Utilisateur.findOne({ where: { email } });
        if (!user) {
          user = await Utilisateur.create({
            nom: profile.name.familyName,
            prenom: profile.name.givenName,
            email,
            etat:'autorise'
            // Default values or null for other fields
          });
          const loginSuccess = loginSuccessEmailTemplate(user.nom,user.prenom);
          const confirmationData = {
            from: FROM_EMAIL,
            to: user.email,
            subject: "Connexion réussie",
            html: loginSuccess,
          };
          await smtpTransport.sendMail(confirmationData);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id_utilisateur);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Utilisateur.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//rania