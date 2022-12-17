import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../shared/dtos/jwt-payload.dto';
import { UserEntity } from '../db/entities/users.entity';
import { ROLES } from '../shared/enums/roles.enum';
import { STATUS } from '../shared/enums/status.enum';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../db/db.service';
import { AccountService } from '../account/account.service';
import { RefreshJWTPayload } from 'src/shared/dtos/refresh-jwt-payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(body: SignUpDTO): Promise<UserEntity> {
    // hash password
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = await this.userService.insertNew({
      ...body,
      password: hash,
    });
    if (!newUser) {
      // All conflict related exceptions are thrown within the userService
      throw new InternalServerErrorException();
    }
    this.accountService.sendVerifyMail(newUser);
    return newUser;
  }

  async login(body: LoginDTO) {
    const user = await this.userService.findOneByEmail(body.email);
    if (
      !user ||
      user.status === STATUS.BANNED ||
      !(await bcrypt.compare(body.password, user.password))
    ) {
      throw new UnauthorizedException();
    }
    // This is not awaited, as it is not necessary for the response
    return await this.getAuthPayload(user);
  }

  async getAuthPayload(user: UserEntity) {
    this.userService.setLoginTimestamp(user.pkUserId);
    return {
      access_token: await this.generateJWTToken(user),
      refresh_token: await this.generateRefreshToken(user),
    };
  }

  private async generateRefreshToken(user: UserEntity) {
    return await this.jwtService.sign(
      {
        id: user.pkUserId,
        email: user.email,
      } as RefreshJWTPayload,
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRE_TIME') },
    );
  }

  private async generateJWTToken(user: UserEntity) {
    return await this.jwtService.sign({
      username: user.username,
      id: user.pkUserId,
      email: user.email,
      status: user.status as STATUS,
      role: user.role as ROLES,
    } as JWTPayload);
  }
}
