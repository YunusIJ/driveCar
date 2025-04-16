import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

// 🔐 User signup & login
router.post('/signup', registerUser);
router.post('/login', loginUser);

// 👤 Authenticated user actions
router.get('/profile', authenticateJWT, getProfile);
router.post('/logout', logoutUser);

export default router;
