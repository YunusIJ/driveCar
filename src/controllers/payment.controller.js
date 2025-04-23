import axios from 'axios';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Car from '../models/car.model.js';
import generatePDFReceipt from '../utils/pdfGenerator.js';
import fs from 'fs';
import path from 'path';

export const initiateBooking = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields: carId, startDate, endDate"
      });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (!car.available) {
      return res.status(400).json({ message: "Car is not available" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = days * car.pricePerDay;

    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalAmount,
      status: 'PENDING'
    });

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userEmail,
        amount: totalAmount * 100,
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

export const handlePaystackWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('Webhook received:', event.event);

    if (event.event === 'charge.success') {
      const { data } = event;
      const metadata = data.metadata;
      console.log('Payment metadata:', metadata);

      if (!metadata.bookingId) {
        console.error('No bookingId in metadata');
        return res.status(400).json({ message: 'Missing bookingId' });
      }

      const booking = await Booking.findByPk(metadata.bookingId);
      
      if (!booking) {
        console.error(`Booking not found: ${metadata.bookingId}`);
        return res.status(404).json({ message: 'Booking not found' });
      }

      const [updatedRows] = await Booking.update(
        {
          status: 'PAID',
          paymentReference: data.reference,
          updatedAt: new Date()
        },
        {
          where: { id: metadata.bookingId },
          returning: true
        }
      );

      console.log('Updated rows:', updatedRows);

      const verifyBooking = await Booking.findByPk(metadata.bookingId);
      console.log('Verified booking status:', verifyBooking.status);

      await Car.update(
        { available: false },
        { where: { id: booking.carId } }
      );

      console.log(`Booking ${metadata.bookingId} marked as PAID`);
      return res.status(200).json({ 
        message: 'Webhook processed successfully',
        bookingStatus: verifyBooking.status 
      });
    }

    console.log('Unhandled event type:', event.event);
    return res.status(200).json({ message: 'Unhandled event type' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    console.error('Error details:', error.stack);
    return res.status(500).json({ 
      message: 'Error processing webhook',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export const downloadReceipt = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['brand', 'model', 'year', 'pricePerDay']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'PAID') {
      return res.status(400).json({
        message: 'Receipt not available - payment pending',
        status: booking.status
      });
    }

    const user = await User.findById(booking.userId);

    const receiptData = {
      ...booking.toJSON(),
      user,
      car: booking.car,
      paymentStatus: booking.status
    };

    const filePath = await generatePDFReceipt(receiptData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${bookingId}.pdf"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error removing receipt:', err);
      });
    });

    stream.on('error', (err) => {
      console.error("PDF stream error:", err);
      res.status(500).json({ message: 'Error sending PDF file' });
    });

  } catch (error) {
    console.error('Receipt Error:', error);
    res.status(500).json({
      message: 'Failed to download receipt',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
