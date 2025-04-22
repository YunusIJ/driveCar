import axios from 'axios';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Car from '../models/car.model.js';
import generatePDFReceipt from '../utils/pdfGenerator.js';
import fs from 'fs';
import path from 'path';

export const initiateBooking = async (req, res) => {
  try {
    const { email, userId, carId, startDate, endDate } = req.body;

    // Validate input
    if (!email || !userId || !carId || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get the car price per day from the DB
    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalAmount = days * car.pricePerDay;

    // Save booking first
    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalAmount,
      paymentStatus: 'pending'
    });

    // Call Paystack to initiate payment
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: totalAmount * 100, // in kobo
        metadata: {
          userId,
          carId,
          bookingId,
          startDate,
          endDate,
          totalAmount
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      message: 'Payment initiated',
      authorization_url: response.data.data.authorization_url,
      bookingId: newBooking.id  // ✅ Make sure this now works
    });

  } catch (error) {
    console.error('Payment Init Error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

export const handlePaystackWebhook = async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const metadata = event.data.metadata;

    try {
      const bookingId = metadata.bookingId;

      // ✅ Find and update the booking
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        booking.paymentStatus = 'PAID';
        await booking.save();

        console.log(`✅ Booking ${bookingId} marked as PAID`);
      }

      return res.status(200).send('Webhook processed');
    } catch (err) {
      console.error('Webhook error:', err.message);
      return res.status(500).json({ message: 'Error processing webhook' });
    }
  } else {
    return res.status(400).json({ message: 'Event type not handled' });
  }
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


