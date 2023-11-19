import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from 'src/user/user.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly userService: UserService,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    email: string,
  ): Promise<Article> {
    const user = await this.userService.findOne(email);
    console.log('🚀 ~ user:', user);

    const article = this.articleRepository.create({
      ...createArticleDto,
      user,
    });

    return this.articleRepository.save(article);
  }

  async findArticleBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException('Article with provided slug doesnt exist.');
    }

    return article;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Article>> {
    return paginate<Article>(this.articleRepository, options);
  }
}
