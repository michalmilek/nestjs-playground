import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './register-user';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
