import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { downloadReceipt } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/', authenticate, createBooking);

router.get('/receipt/:bookingId', downloadReceipt);

export default router;
