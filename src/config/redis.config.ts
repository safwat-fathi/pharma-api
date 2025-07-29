import { RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { config } from 'dotenv';

config();

export const redisConfig: RedisClientOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
};
