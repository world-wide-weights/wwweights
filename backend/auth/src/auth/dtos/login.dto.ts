import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
