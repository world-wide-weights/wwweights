import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * @description DTO used for register endpoint(s)
 */
export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  @ApiProperty({ description: 'Username for the user', example: 'CoffeeLover' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 256)
  @ApiProperty({
    description: 'Password for the user',
    minLength: 8,
    example: 'verySecurePasswordAlsoUsedByThePentagon',
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email for the user', example: 'test@test.test' })
  email: string;
}
