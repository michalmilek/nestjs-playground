import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    /*   {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }, */
  ],
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  exports: [UserService],
})
export class UserModule {}
