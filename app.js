// app.js
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import connectMongoDB from './src/config/db.js';
import connectPostgres from './src/config/postgress.js';
import './src/config/passport.setup.js';

import authRoutes from './src/routes/auth.route.js';
import carRoutes from './src/routes/car.route.js';


dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Sessions (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'drivecar-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
//app.use('/api/payment', paymentRoutes);

// Database connections
await connectMongoDB();
await connectPostgres();

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` DriveCar server running on http://localhost:${PORT}`));
