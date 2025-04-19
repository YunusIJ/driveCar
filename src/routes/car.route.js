import express from 'express';
import upload from '../middleware/upload.js';
import { addCar, getAvailableCars } from '../controllers/car.controller.js';

const router = express.Router();

router.post('/upload', upload.single('image'), addCar);

router.get('/available', getAvailableCars)

export default router;
