import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  access_token: string;
}
