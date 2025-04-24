import express from 'express';
import { addCar, getAvailableCars } from '../controllers/car.controller.js';
import upload from '../middleware/upload.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/upload', 
  authenticateJWT,
  (req, res, next) => {
    console.log('Starting file upload...'); // Debug log
    next();
  },
  upload.array('carImages', 4),
  (req, res, next) => {
    console.log('Files received:', req.files?.length || 0);
    next();
  },
  addCar
);

router.get('/available', getAvailableCars);

export default router;
