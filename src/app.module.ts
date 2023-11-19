import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
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
    UserModule,
    AuthModule,
    ArticleModule,
  ],
})
export class AppModule {}
