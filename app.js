import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectMongoDB from './src/config/db.js';
import connectPostgres from './src/config/postgress.js';



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


await connectMongoDB();
await connectPostgres();

const PORT = process.env.PORT || 5070;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
