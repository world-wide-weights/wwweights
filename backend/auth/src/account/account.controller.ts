import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { AccountService } from './account.service';
import { AddImageDto } from './dtos/add-image.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('add-image')
  @UseGuards(JwtGuard)
  async addImageToUser(
    @Req() { user }: RequestWithUser,
    @Body() { imageHash }: AddImageDto,
  ) {
    await this.accountService.addImageToUser(user.id, imageHash);
  }
}
