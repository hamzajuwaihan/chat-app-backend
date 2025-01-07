import { CommandFactory } from 'nest-commander';
import { LookupsModule } from '../../lookups.module';

async function bootstrap() {
  await CommandFactory.run(LookupsModule);
}

bootstrap();
