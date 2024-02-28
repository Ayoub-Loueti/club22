const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Utilisateur = require('./models/UtilisateurModel');
require('dotenv').config();


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
            // Default values or null for other fields
          });
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
