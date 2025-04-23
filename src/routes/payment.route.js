import express from 'express';
import {
  initiateBooking,
  handlePaystackWebhook,
  downloadReceipt,
} from '../controllers/payment.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to initiate a car booking and payment
router.post('/book', authenticateJWT, initiateBooking);

// Route to handle Paystack webhook 
router.post('/webhook', express.json(), handlePaystackWebhook);

// Route to download receipt 
router.get('/receipt/:bookingId', authenticateJWT, downloadReceipt);

export default router;
