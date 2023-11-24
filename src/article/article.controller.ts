import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Param,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Article } from './entities/article.entity';
import { User } from 'src/decorators/user.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TokenType } from 'src/auth/types/token';
import { UpdateArticleDto } from './dto/update-article.dto';
import { LikeDto } from 'src/likes/dto/like.dto';
import { LikesService } from 'src/likes/likes.service';
import { Like } from 'src/likes/entities/like.entity';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly likeService: LikesService,
  ) {}

  @Post('/new')
  create(@Body() dto: CreateArticleDto, @Request() req) {
    return this.articleService.createArticle(dto, req.user.email);
  }
  /* 
  @Get()
  async getArticles(): Promise<Article[]> {
    return this.articleService.getArticles();
  } */

  @Get()
  async getArticles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Article>> {
    return this.articleService.paginate({ page, limit, route: '/article' });
  }

  @Get(':slug/slug')
  async getArticleBySlug(@Param('slug') slug: string): Promise<Article> {
    return this.articleService.findArticleBySlug(slug);
  }

  @Delete(':slug/slug')
  async deleteArticle(
    @User('sub') currentUser: TokenType,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticleBySlug(slug, currentUser.sub);
  }

  @Patch(':slug/slug')
  async updateArticle(
    @User('sub') currentUser: TokenType,
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleDto,
  ): Promise<DeleteResult> {
    return this.articleService.updateArticle(dto, slug, currentUser.sub);
  }

  @Post('/add-like')
  async likeArticle(
    @User('sub') currentUser: TokenType,
    @Body() dto: LikeDto,
  ): Promise<Like> {
    const article = await this.articleService.findArticleById(dto.article_id);

    if (!article) {
      throw new NotFoundException('Article with provided id doesnt exist');
    }

    return await this.likeService.likeArticle(dto, currentUser.sub);
  }

  @Post('/add-dislike')
  async dislikeArticle(
    @User('sub') currentUser: TokenType,
    @Body() dto: LikeDto,
  ): Promise<Like | UpdateResult> {
    const article = await this.articleService.findArticleById(dto.article_id);

    if (!article) {
      throw new NotFoundException('Article with provided id doesnt exist');
    }

    return await this.likeService.dislikeArticle(dto, currentUser.sub);
  }

  @Post('/add-to-favourite')
  async addToFavourite(
    @User('sub') currentUser: TokenType,
    @Body() dto: LikeDto,
  ): Promise<Like | UpdateResult> {
    const article = await this.articleService.findArticleById(dto.article_id);

    if (!article) {
      throw new NotFoundException('Article with provided id doesnt exist');
    }

    return await this.likeService.addToFavourite(dto, currentUser.sub);
  }

  @Post('/remove-from-favourite')
  async removeFromFavourite(
    @User('sub') currentUser: TokenType,
    @Body() dto: LikeDto,
  ): Promise<Like | UpdateResult> {
    const article = await this.articleService.findArticleById(dto.article_id);

    if (!article) {
      throw new NotFoundException('Article with provided id doesnt exist');
    }

    return await this.likeService.removeFromFavourite(dto, currentUser.sub);
  }
}
