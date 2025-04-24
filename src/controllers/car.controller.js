import Car from '../models/car.model.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        folder: "drivecar/cars",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const addCar = async (req, res) => {
  try {
    const { brand, model, year, pricePerDay } = req.body;

    // Validate required fields
    if (!brand || !model || !year || !pricePerDay) {
      return res.status(400).json({ 
        message: 'All fields (brand, model, year, pricePerDay) are required' 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    if (req.files.length > 4) {
      return res.status(400).json({ message: 'Maximum 4 images allowed' });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file => streamUpload(file.buffer));
    const uploadResults = await Promise.all(uploadPromises);

    // Create car with multiple image URLs
    const car = await Car.create({
      brand,
      model,
      year: parseInt(year),
      pricePerDay: parseFloat(pricePerDay),
      imageUrls: uploadResults.map(result => result.secure_url),
      mainImageUrl: uploadResults[0].secure_url, // First image as main image
      available: true,
    });

    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      car
    });

  } catch (err) {
    console.error('Error uploading car:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to upload car',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

