# DriveCar - Premium Car Rental Service 🚗

DriveCar is a modern car rental platform built with Node.js, Express, MongoDB, and PostgreSQL. It features secure authentication, payment processing via Paystack, and cloud image storage with Cloudinary.

## Features ✨

- **User Authentication**
  - Email/Password login
  - Facebook OAuth integration
  - JWT token-based security
  - Role-based access (User/Admin)

- **Car Management**
  - Multiple image uploads
  - Detailed car information
  - Real-time availability tracking
  - Advanced search and filtering

- **Booking System**
  - Secure payment processing via Paystack
  - Date-based availability
  - Automated receipt generation (PDF)
  - Booking history tracking

- **Admin Dashboard**
  - Car inventory management
  - Booking oversight
  - User management
  - Analytics and reporting

## Tech Stack 🛠

- **Backend:**
  - Node.js & Express
  - MongoDB (User data)
  - PostgreSQL (Car & Booking data)
  - Sequelize ORM
  - Mongoose ODM

- **Authentication:**
  - JWT
  - Passport.js
  - Facebook OAuth

- **File Handling:**
  - Multer
  - Cloudinary
  - PDFKit

- **Payment:**
  - Paystack Integration

## Prerequisites 📋

Before running this project, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL
- MongoDB
- npm or yarn
- Cloudinary account
- Paystack account
- Facebook Developer account (for OAuth)

## Environment Variables 🔐

Create a `.env` file with the following variables:

```env
PORT=5070
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
MONGO_URI=your_mongodb_uri
POSTGRES_URI=your_postgres_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FACEBOOK_APP_ID=your_fb_app_id
FACEBOOK_APP_SECRET=your_fb_app_secret
FACEBOOK_CALLBACK_URL=your_callback_url
PAYSTACK_SECRET_KEY=your_paystack_key
NODE_ENV=development

Installation 💻
1. Install dependencies: npm install
2. Start the server: npm run dev

API Endpoints 🛣
Authentication

POST /api/users/signup - Register new user
POST /api/users/login - Login user
GET /api/auth/facebook - Facebook OAuth login
POST /api/users/logout - Logout user

Cars
GET /api/cars/available - Get available cars
POST /api/cars/upload - Add new car (Admin)

Bookings
POST /api/payments/book - Create new booking
GET /api/payments/receipt/:bookingId - Download receipt

Admin
POST /api/admin/login - Admin login

Acknowledgments 🙏

Express.js
Sequelize
Mongoose
Cloudinary
Paystack


Author ✍️
Yunus Ishola
