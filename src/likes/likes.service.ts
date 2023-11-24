// likes.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { LikeDto } from './dto/like.dto';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async likeArticle(dto: LikeDto, userCurrentId: number): Promise<Like> {
    const { article_id } = dto;

    const existingLike = await this.likeRepository.findOne({
      where: {
        article: {
          id: article_id,
        },
        user: {
          id: userCurrentId,
        },
      },
    });

    if (existingLike) {
      // Update the existing like
      await this.likeRepository
        .createQueryBuilder()
        .update(Like)
        .set({ type: 'like', timestamp: new Date() })
        .where('id = :id', { id: existingLike.id })
        .execute();

      return existingLike;
    } else {
      const newLike = this.likeRepository.create({
        type: 'like',
        favourite: false,
        user: {
          id: userCurrentId,
        },
        article: {
          id: article_id,
        },
      });
      return newLike;
    }
  }

  async dislikeArticle(
    dto: LikeDto,
    userCurrentId: number,
  ): Promise<Like | UpdateResult> {
    const { article_id } = dto;

    const existingLike = await this.likeRepository.findOne({
      where: {
        article: {
          id: article_id,
        },
        user: {
          id: userCurrentId,
        },
      },
    });

    if (existingLike) {
      const dislike = await this.likeRepository
        .createQueryBuilder()
        .update(Like)
        .set({ type: 'dislike', timestamp: new Date() })
        .where('id = :id', { id: existingLike.id })
        .execute();

      return dislike;
    } else {
      const newDislike = this.likeRepository.create({
        type: 'dislike',
        favourite: false,
        user: {
          id: userCurrentId,
        },
        article: {
          id: article_id,
        },
      });
      return newDislike;
    }
  }

  async addToFavourite(
    dto: LikeDto,
    userCurrentId: number,
  ): Promise<Like | UpdateResult> {
    const { article_id } = dto;

    const existingLike = await this.likeRepository.findOne({
      where: {
        article: {
          id: article_id,
        },
        user: {
          id: userCurrentId,
        },
      },
    });

    if (existingLike) {
      const favouriteItem = await this.likeRepository
        .createQueryBuilder()
        .update(Like)
        .set({ favourite: true, timestamp: new Date() })
        .where('id = :id', { id: existingLike.id })
        .execute();

      return favouriteItem;
    } else {
      const newFavourite = this.likeRepository.create({
        favourite: true,
        user: {
          id: userCurrentId,
        },
        article: {
          id: article_id,
        },
      });
      return newFavourite;
    }
  }

  async removeFromFavourite(
    dto: LikeDto,
    userCurrentId: number,
  ): Promise<Like | UpdateResult> {
    const { article_id } = dto;

    const existingLike = await this.likeRepository.findOne({
      where: {
        article: {
          id: article_id,
        },
        user: {
          id: userCurrentId,
        },
      },
    });

    if (existingLike) {
      const favouriteItem = await this.likeRepository
        .createQueryBuilder()
        .update(Like)
        .set({ favourite: false, timestamp: new Date() })
        .where('id = :id', { id: existingLike.id })
        .execute();

      return favouriteItem;
    } else {
      const newFavourite = this.likeRepository.create({
        favourite: false,
        user: {
          id: userCurrentId,
        },
        article: {
          id: article_id,
        },
      });
      return newFavourite;
    }
  }
}
