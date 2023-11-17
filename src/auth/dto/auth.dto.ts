import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
