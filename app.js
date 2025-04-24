import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedAdmin } from './src/config/adminSeed.js';
import { sequelize } from './src/models/sync.js';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION_URL = 'https://drivecar-4.onrender.com';
const DEVELOPMENT_URL = process.env.NGROK_URL || 'http://localhost:5070';

// Set base URL based on environment
const BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : DEVELOPMENT_URL;
process.env.BASE_URL = BASE_URL;

app.use(cors({
  origin: [DEVELOPMENT_URL, PRODUCTION_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(morgan('dev'));  

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'drivecar-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    rolling: true
  })
);

// Set server timeout
app.use((req, res, next) => {
  req.setTimeout(20000);
  res.setTimeout(20000);
  next();
});

// Add this before your route handlers
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files. Maximum is 4 files' 
      });
    }
    return res.status(400).json({ 
      message: 'File upload error', 
      error: err.message 
    });
  }
  next(err);
});

// Add this before your routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          success: false,
          message: 'File too large. Maximum size is 5MB' 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          success: false,
          message: 'Too many files. Maximum is 4 files' 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          success: false,
          message: `Unexpected field name. Use 'carImages' for file upload` 
        });
      default:
        return res.status(400).json({ 
          success: false,
          message: 'File upload error',
          error: err.message 
        });
    }
  }
  next(err);
});

app.get("/", (req, res) => {
    res.send("Welcome to DriveCar");
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

try {
  await connectMongoDB();
  await connectPostgres();
  
  const PORT = process.env.PORT || 5070;
  app.listen(PORT, () => {
    console.log(`DriveCar server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

