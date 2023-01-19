import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../db/ user.service';
import { UserEntity } from '../db/entities/users.entity';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly userService: UserService) {}

  /**
   * @description Find user and return profile, fail if User does not exist
   */
  async findUserByIdOrFail(id: number): Promise<UserEntity> {
    try {
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new NotFoundException('User was not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Action could not be performed');
    }
  }
}
