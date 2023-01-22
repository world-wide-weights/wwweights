import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RequestWithUser } from '../shared/interfaces/request-with-user.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @SerializeOptions({
    groups: ['self'],
  })
  @UseGuards(JwtGuard)
  async getMe(@Req() jwtPayload: RequestWithUser) {
    return await this.profileService.findUserByIdOrFail(jwtPayload.user.id);
  }

  @Get(':userId')
  @UseGuards(JwtGuard)
  async getUserProfile(@Param() { userId }: { userId: number }) {
    return await this.profileService.findUserByIdOrFail(userId);
  }
}
