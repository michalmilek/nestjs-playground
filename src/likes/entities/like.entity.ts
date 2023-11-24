// article-like.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.like)
  article: Article;

  @ManyToOne(() => User, (user) => user.like)
  user: User;

  @Column({ type: 'enum', enum: ['like', 'dislike'], nullable: true })
  type: string;

  @Column({ default: false })
  favourite: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
