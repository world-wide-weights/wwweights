import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../db/entities/users.entity';
import { MailVerifyJWTDTO } from '../shared/dtos/mail-jwt-payload.dto';
import { UserService } from '../db/db.service';
import { MailService } from '../mail/mail.service';
import { ERROR_MESSAGES } from '../shared/enums/errors.enum';
import { STATUS } from '../shared/enums/status.enum';

@Injectable()
export class AccountService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async resendVerifyEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    if (user.status === STATUS.BANNED) {
      throw new MethodNotAllowedException(ERROR_MESSAGES.USER_IS_BANNED);
    }
    if (user.status === STATUS.VERIFIED) {
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_VERIFIED);
    }
    await this.sendVerifyMail(user);
  }

  async sendVerifyMail(user: UserEntity) {
    const verifyToken = this.jwtService.sign(
      { id: user.pkUserId } as MailVerifyJWTDTO,
      {
        secret: this.configService.get<string>('JWT_MAIL_VERIFY_SECRET'),
        algorithm: 'HS256',
      },
    );
    this.mailService.sendMail(
      user.email,
      'mail-verify',
      {
        name: user.username,
        verifyLink: `${this.configService.get<string>(
          'SERVICE_ADDRESS',
        )}/account/verify-email/?code=${verifyToken}`,
      },
      'Verify Mail',
    );
  }

  async initiateResetPasswordFlow(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      // Just return to not indicate whether or not user with that email exists
      return;
    }
    this.mailService.sendMail(
      user.email,
      'password-reset',
      {},
      'Reset Password',
    );
  }

  async updatePassword(userId: number, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(userId, hash);
  }

  async verifyEmail(tokenPayload: MailVerifyJWTDTO) {
    this.userService.changeUserStatus(tokenPayload.id, STATUS.VERIFIED);
  }
}
