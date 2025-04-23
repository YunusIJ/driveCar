import { DataTypes } from 'sequelize';
import sequelize from '../config/postgress.js';
import Car from './car.model.js';

const Booking = sequelize.define('Booking', {
  userId: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'PAID', 'FAILED']]
    },
    allowNull: false
  },
  receiptUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Bookings',
  timestamps: true
});



export default Booking;
