import { ConfigModule } from '@nestjs/config';

export const configuration = ConfigModule.forRoot({
  envFilePath: '.env',
});
