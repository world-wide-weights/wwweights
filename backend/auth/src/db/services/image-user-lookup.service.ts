import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ImageUserLookupEntity } from '../entities/image-user-lookup.entity';

@Injectable()
export class ImageUserLookupService {
  private readonly logger = new Logger(ImageUserLookupService.name);

  constructor(
    @InjectRepository(ImageUserLookupEntity)
    private readonly imageUserLookupEntity: Repository<ImageUserLookupEntity>,
  ) { }

  async addHashToUser(userId: number, imageHash: string) {
    const newEntry: ImageUserLookupEntity = {
      fkUserId: userId,
      imageHash: imageHash,
    };
    try {
      await this.imageUserLookupEntity.insert(newEntry);
    } catch (error) {
      if (error instanceof QueryFailedError && 'code' in error) {
        // Duplicate error is allowed => User may have uploaded same image twice
        if (error.code === '23505') {
          this.logger.log(
            `User (${userId} has uploaded image (${imageHash}) for a second time. No values have been inserted)`,
          );
          return;
        }
      }
      this.logger.error(error)
      throw new InternalServerErrorException('Could not persist information.');
    }
  }
}
