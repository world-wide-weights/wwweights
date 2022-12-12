import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
