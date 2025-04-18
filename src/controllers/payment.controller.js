import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Car from '../models/car.model.js';
import Booking from '../models/booking.js';
import { generateReceipt } from '../utils/generateReceipt.js';

export const bookCarAndPay = async (req, res) => {
  try {
    const { carId, daysBooked } = req.body;
    const user = req.user;

    if (!carId || !daysBooked) {
      return res.status(400).json({ message: 'Missing car or booking duration' });
    }

    const car = await Car.findByPk(carId);
    if (!car || !car.available) {
      return res.status(404).json({ message: 'Car not found or unavailable' });
    }

    const totalAmount = car.pricePerDay * daysBooked;
    const amountKobo = totalAmount * 100; // Paystack uses kobo

    
    const paymentInit = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amountKobo,
        metadata: {
          carModel: car.model,
          daysBooked,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const authUrl = paymentInit.data.data.authorization_url;
    const ref = paymentInit.data.data.reference;

    // Record booking with status pending
    const booking = await Booking.create({
      userId: user._id.toString(),
      carId: car.id,
      daysBooked,
      totalAmount,
      paymentReference: ref,
      status: 'PENDING',
    });

    res.json({
      message: 'Booking created. Redirect to Paystack to pay.',
      paystackRedirectUrl: authUrl,
      reference: ref,
      booking,
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};
