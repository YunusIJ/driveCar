import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const getRedirectUrl = (token) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PRODUCTION_URL 
    : process.env.NGROK_URL;
  return `${baseUrl}/auth.html?token=${token}`;
};

const handleAuthError = (err, req, res, next) => {
  console.error('Auth Error:', err);
  if (err.code === 'ECONNRESET') {
    return res.redirect('/login.html?error=connection');
  }
  return res.redirect('/login.html?error=auth');
};

router.get('/facebook', 
  (req, res, next) => {
    passport.authenticate('facebook', { 
      scope: ['email'],
      session: false,
      failureRedirect: '/login.html?error=true',
      successReturnToOrRedirect: '/dashboard',
      keepSessionInfo: true
    })(req, res, next);
  }
);

router.get('/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', { 
      failureRedirect: '/login.html?error=true',
      session: false
    })(req, res, next);
  },
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/login.html?error=nouser');
      }

      const token = jwt.sign(
        { id: req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.redirect(getRedirectUrl(token));
    } catch (error) {
      handleAuthError(error, req, res, next);
    }
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ message: 'User logged out' });
  });
});

// Error handler middleware
router.use(handleAuthError);

export default router;
