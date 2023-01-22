import { Injectable } from '@nestjs/common';
import { ImageUserLookupService } from '../db/services/image-user-lookup.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly imageUserLookupService: ImageUserLookupService,
  ) {}

  async addImageToUser(id: number, imageHash: string) {
    await this.imageUserLookupService.addHashToUser(id, imageHash);
  }
}
