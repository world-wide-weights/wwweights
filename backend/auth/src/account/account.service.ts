import { Injectable, Logger } from '@nestjs/common';
import { ImageUserLookupService } from '../db/services/image-user-lookup.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    private readonly imageUserLookupService: ImageUserLookupService,
  ) {}

  /**
   * @description Link an image to a user within the database
   */
  async addImageToUser(id: number, imageHash: string): Promise<void> {
    this.logger.log('Adding entry for user <-> image');
    await this.imageUserLookupService.addHashToUser(id, imageHash);
  }
}
