// middleware/auth.js
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') return next();
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  };
  