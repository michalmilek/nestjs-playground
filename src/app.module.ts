import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from './tag/tag.module';
import { configuration } from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'mediumclone',
        password: '123',
        database: 'mediumclone',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'prod',
        logging:
          process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      }),
    }),
    TagModule,
  ],
})
export class AppModule {}
