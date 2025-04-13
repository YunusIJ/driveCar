import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('Postgres connection error:', error);
  }
};

export { sequelize };
export default connectPostgres;
