import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private redis: Redis | null = null;

  constructor(@InjectConnection() private readonly connection: Connection) {
    try {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        lazyConnect: true, // Don't connect immediately
      });
    } catch (error) {
      console.log('Redis connection failed, continuing without Redis');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth(): Promise<any> {
    const mongoStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
    let redisStatus = 'unknown';
    if (this.redis) {
      try {
        await this.redis.ping();
        redisStatus = 'connected';
      } catch (error) {
        redisStatus = 'disconnected';
      }
    } else {
      redisStatus = 'not initialized';
    }
    return {
      status: 'ok',
      mongo: mongoStatus,
      redis: redisStatus,
    };
  }
}