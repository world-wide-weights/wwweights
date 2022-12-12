import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { AccountService } from './account.service';
import { ResetPasswordDTO } from './dtos/password-reset.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('resend-verification-email')
  @UseGuards(JwtGuard)
  resendAccountVerifyEmail(@Req() requestWithUser: RequestWithUser) {
    this.accountService.resendVerifyEmail(requestWithUser.user.email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetBody: ResetPasswordDTO) {
    this.accountService.resetPassword(resetBody.email);
  }
}
