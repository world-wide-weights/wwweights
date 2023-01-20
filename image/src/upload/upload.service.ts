import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/shared/interfaces/request-with-user.interface';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  private storePath: string;
  constructor(private readonly configService: ConfigService) {
    this.storePath = this.pathBuilder(
      this.configService.get<string>('IMAGE_STORE_BASE_PATH'),
      'disk',
    );
  }
  async handleImageUpload(user: RequestWithUser, image: Express.Multer.File) {
    const filename = `${image.filename}.${image.mimetype.split('/')[1]}`;
    await fs.rename(
      image.path,
      `${this.storePath}${this.getOSPathSeperator()}${filename}`,
    );
  }

  private pathBuilder(path: string, fallbackFolder: string) {
    // Set OS specific variables for path handling
    const absolutePathIndicator = this.getOSAbsolutePathIndicator();
    const seperatorCharacter = this.getOSPathSeperator();
    // No path? Use local as fallback
    if (!path) {
      return `${process.cwd()}${seperatorCharacter}${fallbackFolder}`;
    }
    // Is absolute path
    if (path.match(absolutePathIndicator)) {
      return path;
    }
    return `${process.cwd()}${seperatorCharacter}${path}`;
  }

  private getOSPathSeperator() {
    return process.platform.startsWith('win') ? '\\' : '/';
  }

  private getOSAbsolutePathIndicator() {
    return process.platform.startsWith('win')
      ? new RegExp('^[A-Z]:.*')
      : new RegExp('^/.*');
  }
}
