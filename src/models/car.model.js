import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgress.js';

const Car = sequelize.define('Car', {
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
});

export default Car;
