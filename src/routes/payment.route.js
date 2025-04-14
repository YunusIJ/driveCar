// routes/payment.routes.js
import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import { bookCarAndPay } from '../controllers/payment.controller.js';

const router = express.Router();

// 🧾 Book a car and pay via Paystack
router.post('/book', ensureAuthenticated, bookCarAndPay);

export default router;
