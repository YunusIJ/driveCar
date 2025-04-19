import Car from '../models/car.model.js';

export const addCar = async (req, res) => {
  try {
    const { brand, model, year, pricePerDay } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = req.file.path; // Cloudinary image URL

    const car = await Car.create({
      brand,
      model,
      year,
      pricePerDay,
      imageUrl,
      available: true,
    });

    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    console.error('Error uploading car:', err);
    res.status(500).json({ message: 'Failed to upload car' });
  }
};


export const getAvailableCars = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to page 1
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    const cars = await Car.findAndCountAll({
      where: { available: true },
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      totalCars: cars.count,
      totalPages: Math.ceil(cars.count / limit),
      currentPage: page,
      cars: cars.rows,
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

