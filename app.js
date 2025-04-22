import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import { seedAdmin } from './src/config/adminSeed.js';
import sequelize from './src/config/postgress.js';


import connectMongoDB from './src/config/db.js';
import { connectPostgres } from './src/config/postgress.js';
import './src/config/passport.setup.js';
import userRoutes from './src/routes/user.route.js';
import adminRoute from './src/routes/admin.route.js';
import paymentRoutes from './src/routes/payment.route.js';



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

app.get("/", (req, res) => {
    res.send("Welcome to DriveCar");
  });

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentRoutes);

// Database connections
await connectMongoDB();
await seedAdmin(); 
await sequelize.sync({ alter: true });


try {
  await connectPostgres();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` DriveCar server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

