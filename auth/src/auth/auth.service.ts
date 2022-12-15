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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
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
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException();
    }

    // This is not awaited, as it is not necessary for the response
    this.userService.setLoginTimestamp(user.pkUserId);
    return await this.generateJWTToken(user);
  }

  async generateJWTToken(user: UserEntity) {
    const token: string = await this.jwtService.sign({
      username: user.username,
      id: user.pkUserId,
      email: user.email,
      status: user.status as STATUS,
      role: user.role as ROLES,
    } as JWTPayload);
    return {
      access_token: token,
    };
  }
}
