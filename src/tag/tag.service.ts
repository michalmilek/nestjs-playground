import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.tagRepository.find();

    if (!tags) {
      throw new NotFoundException();
    }

    return tags;
  }
}
