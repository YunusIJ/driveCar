import express from 'express';
import { uploadCar, getAvailableCars } from '../controllers/car.controller.js';
import { ensureAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

//  Admin can upload new cars
router.post('/', ensureAuthenticated, isAdmin, uploadCar);

//  Public can view 5 available cars at a time
router.get('/', getAvailableCars);

export default router;
