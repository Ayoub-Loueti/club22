const router = require('express').Router();
const passport = require('passport');

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/signup',
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/logout'); // Or wherever you wish to redirect after a successful login
  }
);
router.get('/auth/logout', (req, res) => {
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
      res.clearCookie('connect.sid'); // Make sure this matches your session cookie's name
      return res.json({ message: 'You have been logged out' });
    });
  });
});

module.exports = router;
