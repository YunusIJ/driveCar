import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.postgres.js';
import Car from './Car.js';

const Booking = sequelize.define('Booking', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carId: {
    type: DataTypes.INTEGER,
    references: {
      model: Car,
      key: 'id',
    },
    allowNull: false,
  },
  daysBooked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentReference: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    enum: ['PENDING', 'PAID'],
    defaultValue: 'PENDING',
  },
});

export default Booking;
