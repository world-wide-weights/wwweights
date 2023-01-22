import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
