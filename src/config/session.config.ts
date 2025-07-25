import * as session from 'express-session'; 
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import { redisConfig } from './redis.config';
import type { RequestHandler } from 'express';
import { config } from 'dotenv';

config();

export default function sessionConfig(): RequestHandler {
  // 1) create an ioredis client
  const redisClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    // password, tls, etc.
  });

  // 2) wire up connect-redis (v6) with express-session
  const store = new RedisStore({
    client: redisClient,
  });

  return session({
    store,
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    },
    name: 'sessionId',
  });
}
