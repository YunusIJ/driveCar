import { DataTypes } from 'sequelize';
import sequelize from '../config/postgress.js';

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
    defaultValue: 'pending',
  },
  receiptUrl: {
    type: DataTypes.STRING,
    
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING', // gets updated to 'PAID' on successful webhook
    },
    
  }
});


export default Booking;
