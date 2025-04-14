import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect user to Facebook for authentication
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: true, // This uses passport-session strategy
  }),
  (req, res) => {
    // Successful login
    res.json({
      message: 'Facebook login successful!',
      user: req.user,
    });
  }
);

// 🧪 Optional: Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ message: 'User logged out' });
  });
});

export default router;
