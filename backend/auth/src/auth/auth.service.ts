import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash as bhash, compare } from 'bcrypt';
import { UserEntity } from '../db/entities/users.entity';
import { UserService } from '../db/services/user.service';
import { JWTPayload } from '../shared/interfaces/jwt-payload.interface';
import { ROLES } from '../shared/enums/roles.enum';
import { STATUS } from '../shared/enums/status.enum';
import { LoginDTO } from './dtos/login.dto';
import { RefreshJWTPayload } from './interfaces/refresh-jwt-payload.interface';
import { RegisterDTO } from './dtos/register.dto';
import { TokenResponse } from './responses/token.response';

import { createPublicKey } from 'crypto';
import { RsaJWK, RsaJWKBase } from './responses/jwks.response';
import { AuthStatisticsResponse } from './responses/auth-statistics.response';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description Initiate user registration
   */
  async register(body: RegisterDTO): Promise<TokenResponse> {
    // hash password
    const hash = await bhash(body.password, 10);
    const newUser = await this.userService.insertUser({
      ...body,
      password: hash,
    });
    /* istanbul ignore if */
    if (!newUser) {
      this.logger.error(
        'An unexpected error occured. Creation of user did not fail but also did not return user',
      );
      // All conflict related exceptions are thrown within the userService
      // This is only a safeguard that should never be reached (in theory)
      throw new InternalServerErrorException();
    }
    return await this.getAuthPayload(newUser);
  }

  /**
   * @description Initiate user login
   */
  async login(body: LoginDTO): Promise<TokenResponse> {
    let user: UserEntity;
    try {
      user = await this.userService.findOneByEmail(body.email);
    } catch (error) /* istanbul ignore next */ {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
    if (
      !user ||
      user.status === STATUS.BANNED ||
      !(await compare(body.password, user.password))
    ) {
      this.logger.warn(`Attempted but invalid login for user ${body.email}`);
      throw new UnauthorizedException();
    }
    return await this.getAuthPayload(user);
  }

  /**
   * @description Generate tokens
   */
  async getAuthPayload(user: UserEntity): Promise<TokenResponse> {
    await this.userService.setLoginTimestamp(user.pkUserId);
    return {
      access_token: await this.generateJWTToken(user),
      refresh_token: await this.generateRefreshToken(user),
    };
  }

  /**
   * @description Generate refresh token for passed user
   */
  private async generateRefreshToken(user: UserEntity): Promise<string> {
    return await this.jwtService.sign(
      {
        id: user.pkUserId,
        email: user.email,
      } as RefreshJWTPayload,
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRE_TIME') },
    );
  }

  /**
   * @description Generate access token for passed user
   */
  private async generateJWTToken(user: UserEntity): Promise<string> {
    return this.jwtService.sign(
      {
        username: user.username,
        id: user.pkUserId,
        email: user.email,
        status: user.status as STATUS,
        role: user.role as ROLES,
      } as JWTPayload,
      { keyid: this.configService.get<string>('JWT_AUTH_KID') },
    );
  }

  /**
   * @description Generate JWK for base auth JWTs
   */
  getJWKSPayload(): RsaJWK {
    const authBaseJWK = createPublicKey(
      this.configService.get<string>('JWT_PUBLIC_KEY') as string,
    ).export({ format: 'jwk' }) as RsaJWKBase;
    return {
      ...authBaseJWK,
      alg: 'RS256',
      use: 'sig',
      kid: this.configService.get<string>('JWT_AUTH_KID'),
    };
  }

  /**
   * @description Get auth statistics
   */
  async getAuthStatistics(): Promise<AuthStatisticsResponse> {
    let totalUsersCount = 0;
    try {
      totalUsersCount = await this.userService.getUserCount();
    } catch (error) /* istanbul ignore next */ {
      this.logger.warn(
        `Could not receive total user count due to an error ${error}`,
      );
      throw new InternalServerErrorException();
    }
    return {
      totalUsers: totalUsersCount,
    };
  }
}
