import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

import { Redis } from 'ioredis';

@Injectable()
export class SessionsService {
  private readonly redis: Redis;
  private readonly SESSION_TTL = 3600; // 1 hour

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async getSession(sessionId: string): Promise<any> {
    const sessionData = await this.redis.get(sessionId);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  async setSession(sessionId: string, data: any): Promise<void> {
    await this.redis.set(
      sessionId,
      JSON.stringify(data),
      'EX',
      this.SESSION_TTL,
    );
  }

  async clearSession(sessionId: string): Promise<void> {
    await this.redis.del(sessionId);
  }
}
