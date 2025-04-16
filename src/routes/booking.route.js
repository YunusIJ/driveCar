import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createBooking);

export default router;
