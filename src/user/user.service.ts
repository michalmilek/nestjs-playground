import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;

    const existingUserWithEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    const existingUserWithUsername = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (existingUserWithEmail) {
      throw new Error('User with this email already exists');
    }

    if (existingUserWithUsername) {
      throw new Error('User with this username already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User with provided email doesnt exist.');
    }

    return user;
  }
}
