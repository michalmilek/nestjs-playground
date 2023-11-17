import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/register-user';
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

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

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
      throw new ConflictException('User with provided email already exists.');
    }
    if (existingUserWithUsername) {
      throw new ConflictException(
        'User with provided username already exists.',
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hash,
    });

    const savedUser = await this.userRepository.save(newUser);

    return plainToClass(User, savedUser, { excludeExtraneousValues: true });
  }
}
