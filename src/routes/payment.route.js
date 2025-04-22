import express from 'express';
import {
  initiateBooking,
  handlePaystackWebhook,
  downloadReceipt,
} from '../controllers/payment.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// 📌 Route to initiate a car booking and payment
router.post('/book', verifyToken, initiateBooking);

// 📌 Route to handle Paystack webhook (no auth)
router.post('/webhook', express.json({ type: '*/*' }), handlePaystackWebhook);

// 📌 Route to download receipt (optional: protect if needed)
router.get('/receipt/:bookingId', downloadReceipt);

export default router;
