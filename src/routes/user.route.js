import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);


router.get('/profile', authenticateJWT, getProfile);
router.post('/logout', logoutUser);

export default router;
