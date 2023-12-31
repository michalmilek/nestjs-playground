import slugify from 'slugify';
import { Like } from 'src/likes/entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['slug'])
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column('simple-array', { default: [] })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.article, { eager: true })
  user: User;

  @OneToMany(() => Like, (like) => like.article, {
    cascade: true,
  })
  like: Like[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = `${slugify(this.title, { lower: true })}-${this.id}`;
  }
}
