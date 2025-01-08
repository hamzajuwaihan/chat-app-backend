import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { RedisService } from 'src/app/infrastructure/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => await this.http.pingCheck('self', 'http://localhost:3000/'),
      async () => await this.db.pingCheck('database'),
      async () => {
        const isHealthy = await this.redisService.isRedisHealthy();
        return isHealthy
          ? { redis: { status: 'up' } }
          : { redis: { status: 'down' } };
      },
    ]);
  }
}
