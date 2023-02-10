import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { JWTPayload } from './jwt-payload.dto';

export class JwtWithUserDto {
  @Type(() => JWTPayload)
  @IsNotEmpty()
  user: JWTPayload;
}
