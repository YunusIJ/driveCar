import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL connection established successfully');
    return true;
  } catch (error) {
    console.error(' Unable to connect to PostgreSQL:', error);
    throw error;
  }
};

export { sequelize as default };
