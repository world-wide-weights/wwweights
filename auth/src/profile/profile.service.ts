import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../db/db.service';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  /**
   * @description Find user and return profile, fail if User does not exist
   */
  async findUserByIdOrFail(id: number) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return user;
  }
}
