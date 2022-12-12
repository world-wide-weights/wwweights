import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { ERROR_MESSAGES } from '../shared/enums/errors.enum';
import { STATUS } from '../shared/enums/status.enum';
import { UserService } from '../shared/services/user.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
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
    this.mailService.sendMail(user.email, 'mail-verify', {}, 'Verify Mail');
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
}
