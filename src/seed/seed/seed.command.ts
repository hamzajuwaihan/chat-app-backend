import { Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { SeedService } from './seed.service';

@Injectable()
@Command({ name: 'db:seed', description: 'Seed the database' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    console.log('🌱 Running database seeder...');
    await this.seedService.run();
    console.log('✅ Seeding completed.');
  }
}
