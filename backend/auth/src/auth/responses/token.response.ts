import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * @description Response for returning access_- and refresh_token
 */
export class TokenResponse {
  @Expose()
  @ApiProperty({
    description: 'JWT access_token used for direct acces to proteced endpoints',
  })
  access_token: string;
  @Expose()
  @ApiProperty({
    description: 'JWT refresh_token used for refreshing the access_token',
  })
  refresh_token: string;

  constructor(data: Partial<TokenResponse>) {
    Object.assign(this, data);
  }
}
