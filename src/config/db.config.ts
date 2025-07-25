import { MongooseModuleOptions } from '@nestjs/mongoose';
import { config } from 'dotenv';

config();

const dbConfig: MongooseModuleOptions = {
  uri: process.env.MONGO_URI,
};

export const URI = process.env.MONGO_URI || '';

export default dbConfig;
