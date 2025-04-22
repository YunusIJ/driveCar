import express from 'express';
import { downloadReceipt, initiateBooking } from '../controllers/payment.controller.js';
import { handlePaystackWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handlePaystackWebhook);
router.post('/book', initiateBooking);
router.get('/receipt/:bookingId', downloadReceipt);

export default router;
