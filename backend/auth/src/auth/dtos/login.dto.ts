import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

/**
 * @description DTO used for login endpoint(s)
 */
export class LoginDTO {
  @IsEmail()
  @ApiProperty({ description: 'Email of the user', example: 'test@test.test' })
  email: string;

  @IsString()
  @Length(8, 256)
  @ApiProperty({
    description: 'Password for user',
    example: 'verySecurePasswordAlsoUsedByThePentagon',
  })
  password: string;
}
