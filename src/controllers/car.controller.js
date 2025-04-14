import Car from '../models/car.model.js';

//  Admin uploads a new car
export const uploadCar = async (req, res) => {
  try {
    const { model, brand, pricePerDay, imageUrl } = req.body;

    if (!model || !brand || !pricePerDay) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCar = await Car.create({
      model,
      brand,
      pricePerDay,
      imageUrl,
      available: true,
    });

    res.status(201).json({
      message: 'Car added successfully',
      car: newCar,
    });
  } catch (error) {
    console.error('Upload Car Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  Public fetch 5 available cars with pagination
export const getAvailableCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const cars = await Car.findAll({
      where: { available: true },
      limit,
      offset,
    });

    res.status(200).json({
      page,
      results: cars.length,
      cars,
    });
  } catch (error) {
    console.error('Fetch Cars Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
