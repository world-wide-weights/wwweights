import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @ApiProperty({ description: 'Email of the user', example: 'test@test.test' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Password for user', example: 'stringst' })
  password: string;
}
