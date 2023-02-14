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
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('me')
  @SerializeOptions({
    groups: ['self'],
  })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    description: 'Get own profile with confidential information',
  })
  @ApiOkResponse({ description: 'Profile return', type: UserEntity })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid access token',
  })
  async getMe(@Req() jwtPayload: RequestWithUser): Promise<UserEntity> {
    return await this.profileService.findUserByIdOrFail(jwtPayload.user.id);
  }

  @Get(':userId')
  @ApiOperation({ description: 'Get profile of user by id' })
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
