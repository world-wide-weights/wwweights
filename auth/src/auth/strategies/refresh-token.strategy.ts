import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../db/db.service';
import { RefreshJWTPayload } from '../../shared/dtos/refresh-jwt-payload.dto';
import { STATUS } from '../../shared/enums/status.enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_PUBLIC_KEY'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: RefreshJWTPayload) {
    const user = await this.userService.findOneById(payload.id);
    if (!user || user.status === STATUS.BANNED) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
