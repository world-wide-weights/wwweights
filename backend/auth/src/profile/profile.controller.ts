import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UserEntity } from '../db/entities/users.entity';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithJWTPayload } from '../shared/interfaces/request-with-user.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profile')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @SerializeOptions({
    groups: ['self'],
  })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Get own profile with confidential information',
  })
  @ApiOkResponse({ description: 'Profile return', type: UserEntity })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  async getMe(@Req() { user }: RequestWithJWTPayload): Promise<UserEntity> {
    return await this.profileService.findUserByIdOrFail(user.id);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get profile of user by id' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Profile return',
    type: UserEntity,
  })
  async getUserProfile(@Param() { userId }: { userId: number }) {
    return await this.profileService.findUserByIdOrFail(userId);
  }
}
