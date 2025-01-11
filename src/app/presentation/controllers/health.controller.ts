import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { CacheService } from 'src/app/infrastructure/cache/cache.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => await this.http.pingCheck('self', 'http://localhost:3000/'),
      async () => await this.db.pingCheck('database'),
      async () => {
        const isHealthy = await this.cacheService.isValkeyHealthy();
        return isHealthy
          ? { valkey: { status: 'up' } }
          : { valkey: { status: 'down' } };
      },
    ]);
  }
}
