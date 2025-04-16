import Booking from '../models/booking.model.js';
import Car from '../models/car.model.js';
import { differenceInDays, parseISO } from 'date-fns';

export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;

    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const days = differenceInDays(parseISO(endDate), parseISO(startDate));
    if (days <= 0) return res.status(400).json({ message: 'Invalid booking range' });

    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
