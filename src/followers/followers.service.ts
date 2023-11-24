import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Followers } from './entities/followers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Followers)
    private readonly followersRepository: Repository<Followers>,
  ) {}

  async follow(followerId: number, followedId: number) {
    const newFollower = this.followersRepository.create({
      followers: {
        id: followerId,
      },
      following: {
        id: followedId,
      },
    });

    return this.followersRepository.save(newFollower);
  }

  async unfollow(followerId: number, followedId: number) {
    return this.followersRepository.delete({
      followers: {
        id: followerId,
      },
      following: {
        id: followedId,
      },
    });
  }
}
