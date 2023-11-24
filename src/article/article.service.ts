import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserService } from 'src/user/user.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { UpdateArticleDto } from './dto/update-article.dto';

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

  async findArticleById(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!article) {
      throw new NotFoundException(
        'Article with the provided ID does not exist.',
      );
    }

    return article;
  }

  async deleteArticleBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new NotFoundException(
        'Article with the provided slug does not exist.',
      );
    }

    if (currentUserId !== article.user.id) {
      throw new ForbiddenException(
        'You have to be an author to delete article.',
      );
    }

    return await this.articleRepository.delete(article.id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Article>> {
    return paginate<Article>(this.articleRepository, options);
  }

  async updateArticle(
    dto: UpdateArticleDto,
    slug: string,
    currentUserId: number,
  ): Promise<UpdateResult> {
    const article = await this.findArticleBySlug(slug);

    if (!article) {
      throw new NotFoundException(
        'Article with the provided slug does not exist.',
      );
    }

    if (currentUserId !== article.user.id) {
      throw new ForbiddenException('You have to be an author to edit article.');
    }

    const updatedArticle = await this.articleRepository.update({ slug }, dto);

    return updatedArticle;
  }
}
