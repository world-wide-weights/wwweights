import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from '../shared/guards/api-key.guard';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { AccountService } from './account.service';
import { AddImageDto } from './dtos/add-image.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('add-image')
  @UseGuards(JwtGuard, ApiKeyGuard)
  @ApiOperation({ description: 'INTERNAL ENDPOINT - Used for adding reference between image and user' })
  @ApiBody({ type: AddImageDto })
  @ApiInternalServerErrorResponse({ description: 'Most likely database related errors' })
  @ApiUnauthorizedResponse({ description: 'Invalid JWT or invalid api key' })
  @ApiCreatedResponse({ description: 'Reference has been added' })
  @ApiBearerAuth('access_token')
  @ApiSecurity('api_key')
  async addImageToUser(
    @Req() { user }: RequestWithUser,
    @Body() { imageHash }: AddImageDto,
  ) {
    await this.accountService.addImageToUser(user.id, imageHash);
  }
}
