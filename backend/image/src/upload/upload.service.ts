import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as fsProm from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { InternalCommunicationService } from '../internal-communication/internal-communication.service';
import {
  pathBuilder,
  validateOrCreateDirectory
} from '../shared/helpers/file-path.helpers';
import { ImageUploadResponse } from './responses/upload-image.response';

// Code assumes that either UNIX or Windows paths are valid. Any other OS or path format is not supported

@Injectable()
export class UploadService {
  private storePath: string;
  private cachePath: string;
  private readonly logger = new Logger(UploadService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly internalCommunicationService: InternalCommunicationService,
  ) {
    this.storePath = pathBuilder(
      this.configService.get<string>('IMAGE_STORE_BASE_PATH'),
      'disk',
    );
    validateOrCreateDirectory(this.storePath);
    this.cachePath = pathBuilder(
      this.configService.get<string>('IMAGE_STORE_INCOMING_CACHE_PATH'),
      'cache',
    );
    validateOrCreateDirectory(this.cachePath);
  }
  /**
   * @description Handle uploaded image including duplicate check, hashing and saving it
   */
  async handleImageUpload(userJWT: string, image: Express.Multer.File): Promise<ImageUploadResponse> {
    const cachedFilePath = path.join(this.cachePath, image.filename);

    // Crop the image before hashing => otherwise hashing would be useless
    await this.cropImage(cachedFilePath, 512, 512);

    // TODO: Remove all geographic data etc. from image file

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
          path: `${hash}.${image.mimetype.split('/')[1]}`,
        });
      }
      // Copy rather than move to allow for "moving" accross devices (i.e. docker volumes)
      await fsProm.copyFile(cachedFilePath, fileTargetPath);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    } finally {
      // Cleanup cache
      await fsProm.rm(cachedFilePath, { force: true });
    }

    try {
      await this.internalCommunicationService.notifyAuthAboutNewImage(
        userJWT,
        `${hash}.${image.mimetype.split('/')[1]}`,
      );
    } catch (error) {
      this.logger.warn(
        `An upload failed because the auth backend could not be reached. This could indicate a crashed auth service`,
      );
      // A file without an owner is not allowed => cleanup
      fs.rmSync(fileTargetPath);
      if (error instanceof HttpException) {
        throw error;
      }
    }

    return { path: hash };
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
   * @description Replace an image with an image of the provided size if necessary (i.e. the image is bigger than the provided dimension)
   */
  private async cropImage(
    sourcePath: string,
    wDimension: number,
    hDimension: number,
  ) {
    if (!fs.existsSync(sourcePath)) {
      throw new InternalServerErrorException(
        'Image could not be found within cache',
      );
    }
    if (fs.lstatSync(sourcePath).isDirectory()) {
      throw new InternalServerErrorException('Cannot crop directory');
    }
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    // Image is smaller or equal to the size limit
    if (metadata.width <= wDimension && metadata.height <= hDimension) {
      return;
    }
    // Calculate offset so the image is cropped symetrically
    const wOffset = Math.floor((metadata.width - wDimension) / 2);
    const hOffset = Math.floor((metadata.height - hDimension) / 2);
    try {
      const buffer = await image
        .extract({
          width: Math.min(wDimension, metadata.width),
          height: Math.min(hDimension, metadata.height),
          left: wOffset,
          top: hOffset,
        })
        .toBuffer();
      await fsProm.writeFile(sourcePath, buffer);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Image cropping failed');
    }
  }
}
