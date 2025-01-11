import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  public client: Redis;
  private isHealthy: boolean = false;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('CACHE_HOST', 'localhost'),
      port: this.configService.get<number>('CACHE_PORT', 6379),
    });

    this.client.on('connect', () => {
      Logger.log('✅ Connected to Valkey (Cache)');
      this.isHealthy = true;
    });
    this.client.on('error', (err) => {
      console.error('❌ Valkey error:', err);
      this.isHealthy = false;
    });
    this.client.on('close', () => {
      Logger.log('Valkey connection closed');
      this.isHealthy = false;
    });
    this.client.on('reconnecting', () => {
      Logger.log('Reconnecting to Valkey...');
      this.isHealthy = false;
    });
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
  async isValkeyHealthy(): Promise<boolean> {
    if (this.isHealthy) {
      try {
        await this.client.ping();
        return true;
      } catch (error) {
        this.isHealthy = false;
        console.error('Valkey ping failed:', error);
        return false;
      }
    }
    return false;
  }
}
