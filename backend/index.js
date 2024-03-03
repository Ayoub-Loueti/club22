const express = require('express');
const mydb = require('./config/db');
const app = express();
const utilisateur = require('./routes/UtilisateurRoute');
const admin = require('./routes/AdminRoute');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passportSetup'); // Path to your passport configuration file
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust this to match your frontend's URL
    credentials: true, // Allows cookies and credentials to be sent along with the request
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      httpOnly: true, // Helps mitigate XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours, for example
    },
  })
);
// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use(utilisateur);
app.use(admin);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});



