import sequelize from '../config/postgress.js';
import Car from './car.model.js';
import Booking from './booking.model.js';


Booking.belongsTo(Car, { foreignKey: 'carId', as: 'car' });
Car.hasMany(Booking, { foreignKey: 'carId' });

export { sequelize, Car, Booking };
