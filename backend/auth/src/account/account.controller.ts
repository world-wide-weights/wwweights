import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../shared/guards/api-key.guard';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithJWTPayload } from '../shared/interfaces/request-with-user.interface';
import { AccountService } from './account.service';
import { AddImageDto } from './dtos/add-image.dto';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('add-image')
  @UseGuards(JwtGuard, ApiKeyGuard)
  @ApiOperation({
    summary:
      'INTERNAL ENDPOINT - Used for adding reference between image and user',
  })
  @ApiBody({ type: AddImageDto })
  @ApiInternalServerErrorResponse({
    description: 'Most likely database related errors',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid JWT or invalid api key' })
  @ApiCreatedResponse({ description: 'Reference has been added' })
  @ApiBearerAuth('access_token')
  @ApiSecurity('api_key')
  async addImageToUser(
    @Req() { user }: RequestWithJWTPayload,
    @Body() { imageHash }: AddImageDto,
  ): Promise<void> {
    await this.accountService.addImageToUser(user.id, imageHash);
  }
}
