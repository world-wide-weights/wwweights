import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ResetJWTGuard } from '../shared/guards/mail-jwt.guard';
import { RequestWithId } from '../shared/interfaces/request-with-id.interface';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { AccountService } from './account.service';
import { ResetPasswordDTO } from './dtos/password-reset.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('resend-verification-email')
  @UseGuards(JwtGuard)
  resendAccountVerifyEmail(@Req() requestWithUser: RequestWithUser) {
    this.accountService.resendVerifyEmail(requestWithUser.user.email);
  }

  @Post('send-reset-password-mail')
  initiatePasswordResetFlow(@Body() resetBody: ResetPasswordDTO) {
    this.accountService.initiateResetPasswordFlow(resetBody.email);
  }

  @Post('reset-password')
  @UseGuards(ResetJWTGuard)
  updatePassword(
    @Body() updatePasswordBody: UpdatePasswordDTO,
    @Req() requestWithId: RequestWithId,
  ) {
    this.accountService.updatePassword(
      requestWithId.id,
      updatePasswordBody.password,
    );
  }
}
