import {
  ConflictException,
  HttpException,
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

// Code assumes that either UNIX or Windows paths are valid. Any other OS or path format is not supported

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
  /**
   * @description Handle uploaded image including duplicate check, hashing and saving it
   */
  async handleImageUpload(user: RequestWithUser, image: Express.Multer.File) {
    const cachedFilePath = path.join(this.cachePath, image.filename);
    const hash = await this.hashFile(cachedFilePath);
    const fileTargetPath = path.join(
      this.storePath,
      `${hash}.${image.mimetype.split('/')[1]}`,
    );

    try {
      if (fs.existsSync(fileTargetPath)) {
        // Image is duplicate => return error along with the hash => no duplicate files
        throw new ConflictException({
          message:
            'This file already seems to be uploaded (indicated by m5hash of file)',
          location: `${hash}.${image.mimetype.split('/')[1]}`,
        });
      }
      await fsProm.rename(cachedFilePath, fileTargetPath);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
    // TODO: Notify Auth backend about user event
    return hash;
  }

  /**
   * @description Get Hash for file at given path
   */
  async hashFile(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
      throw new Error('Filepath does not lead to file');
    }
    const fileBuffer = await fsProm.readFile(filePath);
    const hashSum = createHash('sha256').update(fileBuffer);
    return hashSum.digest('hex');
  }

  /**
   * @description Take in path and make sure that it´s a global path and not undefined
   */
  private pathBuilder(initialPath: string, fallbackFolder: string) {
    // Set OS specific variables for path handling
    const absolutePathIndicator = this.getOSAbsolutePathIndicator();
    // No path? Use local as fallback
    if (!initialPath) {
      this.logger.warn('No path passed, so defaulting to fallback');
      return path.resolve(fallbackFolder);
    }
    // Is absolute path
    if (initialPath.match(absolutePathIndicator)) {
      return initialPath;
    }
    return path.resolve(initialPath);
  }
  /**
   * @description Get Regex to detect absolute paths for the current OS
   */
  private getOSAbsolutePathIndicator() {
    return process.platform.startsWith('win')
      ? new RegExp('^[A-Z]:.*')
      : new RegExp('^/.*');
  }
  /**
   * @description Validate a given path to be a directory. If the directory does not yet exist => create it
   */
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
