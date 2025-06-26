const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login dengan Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback dari Google setelah login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Login berhasil, arahkan ke dashboard
    res.redirect('/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  // Passport 0.6+ menggunakan callback
  req.logout(err => {
    if (err) return res.status(500).send('Gagal logout');

    // Hapus session dan cookie
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.send({ message: 'Berhasil logout' });
    });
  });
});

module.exports = router;