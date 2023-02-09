import { Injectable, Logger } from '@nestjs/common';
import { ImageUserLookupService } from '../db/services/image-user-lookup.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    private readonly imageUserLookupService: ImageUserLookupService,
  ) {}

  async addImageToUser(id: number, imageHash: string) {
    this.logger.debug('Adding entry for user <-> image');
    await this.imageUserLookupService.addHashToUser(id, imageHash);
  }
}
