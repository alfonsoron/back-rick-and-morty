import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  mail!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
