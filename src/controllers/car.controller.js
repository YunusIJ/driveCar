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
