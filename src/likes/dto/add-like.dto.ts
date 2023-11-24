import { PartialType } from '@nestjs/swagger';
import { LikeDto } from './like.dto';

export class AddLikeDto extends PartialType(LikeDto) {}
