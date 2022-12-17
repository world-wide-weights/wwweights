import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { AccountService } from './account.service';
import { ResetPasswordDTO } from './dtos/password-reset.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { ResetJWTGuard } from './guards/reset-jwt.guard';
import { MailVerifyJWTGuard } from './guards/mail-verify-jwt.guard';
import { RequestWithMailJwtPayload } from './interfaces/request-mail-verify-jwt-payload.interface';
import { RequestWithResetJWTPayload } from './interfaces/request-with-reset-jwt-payload.interface';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('resend-verification-email')
  @UseGuards(JwtGuard)
  async resendAccountVerifyEmail(@Req() requestWithUser: RequestWithUser) {
    await this.accountService.resendVerifyEmail(requestWithUser.user.email);
  }

  @Post('send-reset-password-mail')
  initiatePasswordResetFlow(@Body() resetBody: ResetPasswordDTO) {
    this.accountService.initiateResetPasswordFlow(resetBody.email);
  }

  @Post('reset-password')
  @UseGuards(ResetJWTGuard)
  updatePassword(
    @Body() updatePasswordBody: UpdatePasswordDTO,
    @Req() requestWithId: RequestWithResetJWTPayload,
  ) {
    this.accountService.updatePassword(
      requestWithId.user.id,
      updatePasswordBody.password,
    );
  }

  @Get('verify-email')
  @UseGuards(MailVerifyJWTGuard)
  verifyMail(@Req() tokenPayload: RequestWithMailJwtPayload) {
    this.accountService.verifyEmail(tokenPayload.user);
  }
}
