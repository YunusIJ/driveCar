import express from 'express';
import { addCar } from '../controllers/car.controller.js';
import upload from '../middleware/upload.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();


router.post('/upload', verifyToken, isAdmin, upload.single('image'), addCar);

export default router;