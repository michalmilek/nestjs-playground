import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthDto } from './dto/auth.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('/sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('/refresh-token')
  refresh(@Body() dto: RefreshTokenDto, @Request() req) {
    return this.authService.refresh(req['user'].email);
  }

  /*   @Post('/sign-out')
  signOut(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/refresh')
  refresh(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  } */
}
