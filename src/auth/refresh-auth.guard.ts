import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenType } from './types/token';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { access_token, refresh_token }: RefreshTokenDto = request.body;

    if (!access_token || !refresh_token) {
      throw new UnauthorizedException('Missing tokens');
    }

    try {
      const accessPayload: TokenType = await this.jwtService.verify(
        access_token,
        {
          secret: 'access',
          ignoreExpiration: true,
        },
      );

      const refreshPayload: TokenType = await this.jwtService.verify(
        refresh_token,
        {
          secret: 'secret',
        },
      );

      if (accessPayload.email !== refreshPayload.email) {
        throw new UnauthorizedException('Invalid tokens23');
      }

      request['user'] = accessPayload;
    } catch {
      throw new UnauthorizedException('Invalid tokens');
    }
    return true;
  }
}
