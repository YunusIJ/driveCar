import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Connection retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for some cloud hosting services
    },
    keepAlive: true
  },
  retry: {
    max: MAX_RETRIES,
    timeout: 60000 // 60 seconds
  }
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const connectPostgres = async () => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await sequelize.authenticate();
      console.log('✅ PostgreSQL connection established successfully');
      
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ PostgreSQL connection attempt ${retries}/${MAX_RETRIES} failed:`, error.message);
      
      if (retries === MAX_RETRIES) {
        console.error('Maximum connection retries reached. Exiting...');
        throw error;
      }
      
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await delay(RETRY_DELAY);
    }
  }
};

// Test the connection immediately
connectPostgres().catch(err => {
  console.error('Failed to establish initial database connection:', err);
  process.exit(1);
});

export { sequelize as default };