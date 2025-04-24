import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established.');
    
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
    throw error;
  }
};

export default sequelize;