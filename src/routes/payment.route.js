import express from 'express';
import { ensureAuthenticated } from '../middleware/auth.js';
import { bookCarAndPay } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/book', ensureAuthenticated, bookCarAndPay);

export default router;
