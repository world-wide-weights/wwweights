import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  access_token: string;
  @Expose()
  refresh_token: string;

  constructor(data: Partial<TokenResponse>) {
    Object.assign(this, data);
  }
}
