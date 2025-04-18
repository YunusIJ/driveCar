import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: true, 
  }),
  (req, res) => {

    res.json({
      message: 'Facebook login successful!',
      user: req.user,
    });
  }
);


router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ message: 'User logged out' });
  });
});

export default router;
