import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followers } from './entities/followers.entity';

@Module({
  controllers: [FollowersController],
  providers: [FollowersService],
  imports: [TypeOrmModule.forFeature([Followers])],
})
export class FollowersModule {}
