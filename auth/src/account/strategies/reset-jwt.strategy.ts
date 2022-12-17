import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResetJWTPayload } from '../dtos/reset-jwt-payload.dto';

@Injectable()
export class ResetJwtStrategy extends PassportStrategy(Strategy, 'reset-jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_RESET_SECRET'),
    });
  }

  async validate(payload: ResetJWTPayload) {
    return payload.id;
  }
}
