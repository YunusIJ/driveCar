import { DataTypes } from 'sequelize';
import sequelize from '../config/postgress.js';

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mainImageUrl: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  imageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'Cars',
  timestamps: true
});

export default Car;
