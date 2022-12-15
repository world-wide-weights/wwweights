import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MailVerifyJWTDTO } from '../dtos/mail-jwt-payload.dto';

@Injectable()
export class MailVerifyJwtStrategy extends PassportStrategy(
  Strategy,
  'mail-verify-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('code'),
      secretOrKey: configService.get<string>('JWT_MAIL_VERIFY_SECRET'),
    });
  }

  async validate(payload: MailVerifyJWTDTO) {
    return payload;
  }
}
