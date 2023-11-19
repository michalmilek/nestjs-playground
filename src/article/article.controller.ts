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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Article } from './entities/article.entity';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
}
