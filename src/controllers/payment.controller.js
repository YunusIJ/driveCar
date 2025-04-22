import axios from 'axios';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Car from '../models/car.model.js';
import generatePDFReceipt from '../utils/pdfGenerator.js';
import fs from 'fs';
import path from 'path';

export const initiateBooking = async (req, res) => {
  try {
    // Add validation for authenticated user
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const { carId, startDate, endDate } = req.body;

    // Validate required fields
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields: carId, startDate, endDate"
      });
    }

    // Get authenticated user
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Check car exists and is available
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (!car.available) {
      return res.status(400).json({ message: "Car is not available" });
    }

    // Calculate booking details
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = days * car.pricePerDay;

    // Create booking
    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalAmount,
      paymentStatus: 'PENDING'
    });

    // Initialize Paystack payment
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userEmail,
        amount: totalAmount * 100, // convert to kobo
        metadata: {
          bookingId: newBooking.id,
          userId,
          carId,
          startDate,
          endDate,
          totalAmount
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Payment initiated",
      authorization_url: paystackResponse.data.data.authorization_url,
      bookingId: newBooking.id,
    });
  } catch (error) {
    console.error("Payment Init Error:", error);
    return res.status(500).json({
      message: "Error initiating payment",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ handlePaystackWebhook function
export const handlePaystackWebhook = async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const metadata = event.data.metadata;

    try {
      const bookingId = metadata.bookingId;

      const booking = await Booking.findByPk(bookingId); // ✅ Sequelize method

      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      // ✅ Update and save
      booking.paymentStatus = 'PAID';
      await booking.save();

      console.log(`✅ Booking ${bookingId} marked as PAID`);
      return res.status(200).send('Webhook processed');
    } catch (err) {
      console.error('Webhook error:', err.message);
      return res.status(500).json({ message: 'Error processing webhook' });
    }
  }

  return res.status(400).json({ message: 'Event type not handled' });
};


export const downloadReceipt = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Fetch booking, user, car from DB (replace with your actual DB queries)
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const user = await User.findById(booking.userId); // or however you fetch user
    const car = await Car.findByPk(booking.carId);
    
    // ✅ Await the file path
    const filePath = await generatePDFReceipt(booking, user, car);
    
    // ✅ Stream PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${bookingId}.pdf"`);
    
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Receipt Error:', error);
    res.status(500).json({ message: 'Failed to download receipt' });
  }
};