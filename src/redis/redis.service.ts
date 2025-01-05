import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  public client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });

    this.client.on('connect', () => console.log('✅ Connected to Redis'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async addToSet(key: string, value: string) {
    return this.client.sadd(key, value);
  }

  async removeFromSet(key: string, value: string) {
    return this.client.srem(key, value);
  }

  async isMemberOfSet(key: string, value: string): Promise<boolean> {
    const result = await this.client.sismember(key, value);
    return result === 1;
  }

  async getSetMembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }
  async addMultipleToSet(key: string, values: string[]) {
    if (values.length === 0) return;
    return this.client.sadd(key, ...values);
  }
}
