import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestWithUser } from 'src/shared/interfaces/request-with-user.interface';
import * as fsProm from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

@Injectable()
export class UploadService {
  private storePath: string;
  private cachePath: string;
  private readonly logger = new Logger(UploadService.name);
  constructor(private readonly configService: ConfigService) {
    this.storePath = this.pathBuilder(
      this.configService.get<string>('IMAGE_STORE_BASE_PATH'),
      'disk',
    );
    this.validateOrCreateDirectory(this.storePath);
    this.cachePath = this.pathBuilder(
      this.configService.get<string>('IMAGE_STORE_INCOMING_CACHE_PATH'),
      'cache',
    );
    this.validateOrCreateDirectory(this.cachePath);
  }
  async handleImageUpload(user: RequestWithUser, image: Express.Multer.File) {
    const cachedFilePath = path.join(this.cachePath, image.filename);
    const hash = await this.hashFile(cachedFilePath);
    const fileTargetPath = path.join(
      this.storePath,
      `${hash}.${image.mimetype.split('/')[1]}`,
    );
    if (fs.existsSync(fileTargetPath)) {
      // Image is duplicate => return error along with the hash => no duplicate files
      throw new ConflictException({
        message:
          'This file already seems to be uploaded (indicated by m5hash of file)',
        location: `${hash}.${image.mimetype.split('/')[1]}`,
      });
    }
    try {
      await fsProm.rename(cachedFilePath, fileTargetPath);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
    return hash;
  }

  async hashFile(filePath: string): Promise<string> {
    const fileBuffer = await fsProm.readFile(filePath);
    const hashSum = createHash('sha256');
    hashSum.update(fileBuffer);

    return hashSum.digest('hex');
  }

  private pathBuilder(initialPath: string, fallbackFolder: string) {
    // Set OS specific variables for path handling
    const absolutePathIndicator = this.getOSAbsolutePathIndicator();
    // No path? Use local as fallback
    if (!initialPath) {
      this.logger.warn('No path passed, so defaulting to fallback');
      return path.join(process.cwd(), fallbackFolder);
    }
    // Is absolute path
    if (initialPath.match(absolutePathIndicator)) {
      return initialPath;
    }
    return path.join(process.cwd(), initialPath);
  }

  private getOSAbsolutePathIndicator() {
    return process.platform.startsWith('win')
      ? new RegExp('^[A-Z]:.*')
      : new RegExp('^/.*');
  }

  private validateOrCreateDirectory(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    if (!fs.lstatSync(path).isDirectory()) {
      throw new Error(
        `${path} does not point to directory and therefore is not allowed in this context`,
      );
    }
  }
}
