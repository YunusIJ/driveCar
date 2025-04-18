import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  };
  
