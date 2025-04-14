import Car from '../models/Car.js';
import connectPostgres from '../config/postgress.js';

const dummyCars = Array.from({ length: 20 }, (_, i) => ({
  model: `Model-${i + 1}`,
  brand: ['Toyota', 'Honda', 'BMW', 'Kia', 'Hyundai'][i % 5],
  pricePerDay: Math.floor(Math.random() * 15000) + 10000,
  imageUrl: `https://placehold.co/600x400?text=Car+${i + 1}`,
  available: true,
}));

const seedCars = async () => {
  try {
    await connectPostgres();
    await Car.sync({ force: false }); // Only sync if needed
    await Car.bulkCreate(dummyCars);
    console.log(' 20 dummy cars inserted successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed dummy cars:', err);
    process.exit(1);
  }
};

seedCars();
