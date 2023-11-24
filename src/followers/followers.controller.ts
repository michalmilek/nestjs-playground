import { Controller, Post, Delete, Param } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { TokenType } from 'src/auth/types/token';
import { User } from 'src/decorators/user.decorator';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':id')
  async follow(@Param('id') id: number, @User('sub') currentUser: TokenType) {
    return this.followersService.follow(currentUser.sub, id);
  }
  @Delete(':id')
  async unfollow(@Param('id') id: number, @User('sub') currentUser: TokenType) {
    return this.followersService.unfollow(currentUser.sub, id);
  }

  @Delete(':id/remove-follower')
  async removeFollower(
    @Param('id') id: number,
    @User('sub') currentUser: TokenType,
  ) {
    return this.followersService.unfollow(id, currentUser.sub);
  }
}
