import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username for the user' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ApiProperty({ description: 'Password for the user', minLength: 8 })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email for the user', example: 'test@test.test' })
  email: string;
}
