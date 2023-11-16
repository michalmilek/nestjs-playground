import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { Article } from './article.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  /*   @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]; */
}
