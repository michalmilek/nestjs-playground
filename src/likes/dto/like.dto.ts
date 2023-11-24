import { Exclude } from 'class-transformer';

export class LikeDto {
  @Exclude()
  article_id: number;

  type: 'like' | 'dislike' | null;

  favourite: boolean;
}
