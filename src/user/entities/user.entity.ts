import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from 'src/auth/entities/auth.entity';
import { Article } from 'src/article/entities/article.entity';

@Entity()
@Unique(['username', 'email'])
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Auth, (rfrTokens) => rfrTokens.user)
  refreshTokens: string[];

  @OneToMany(() => Auth, (article) => article.user)
  article: Article[];
}
