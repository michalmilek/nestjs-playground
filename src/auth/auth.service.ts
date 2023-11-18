import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenType } from './types/token';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  signUp(dto: AuthDto) {
    const user = this.userService.create(dto);

    return user;
  }

  async signIn(
    dto: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = dto;

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);

    return { access_token, refresh_token };
  }
  signOut() {}

  async refresh(email: string): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findOne(email);

      const token = this.generateAccessToken(user);
      return { access_token: token };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: 'access',
      expiresIn: '5m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, {
      secret: 'secret',
      expiresIn: '7d',
    });
  }
}
