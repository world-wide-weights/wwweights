import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { copyFileSync, existsSync, lstatSync, rmSync } from 'fs';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as sharp from 'sharp';
import { InternalCommunicationService } from '../internal-communication/internal-communication.service';
import {
  pathBuilder,
  validateOrCreateDirectory,
} from '../shared/helpers/file-path.helpers';
import { ImageUploadConflictError } from './responses/upload-image-conflict.error';
import { ImageUploadResponse } from './responses/upload-image.response';

// Code assumes that either UNIX or Windows paths are valid. Any other OS or path format is not supported

@Injectable()
export class UploadService {
  private storePath: string;
  private cachePath: string;
  private tmpPath: string;
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
    this.tmpPath = pathBuilder(
      this.configService.get<string>('IMAGE_STORE_TMP_PATH'),
      'tmp',
    );
    validateOrCreateDirectory(this.tmpPath);
  }
  /**
   * @description Handle uploaded image including duplicate check, hashing and saving it
   */
  async handleImageUpload(
    userJWT: string,
    image: Express.Multer.File,
  ): Promise<ImageUploadResponse> {
    const cachedFilePath = join(this.cachePath, image.filename);

    // Crop the image before hashing => otherwise hashing would be useless
    await this.cropImage(cachedFilePath, 512, 512);

    // TODO: Remove all geographic data etc. from image file

    const hash = await this.hashFile(cachedFilePath);
    const fileTargetPath = join(
      this.tmpPath,
      `${hash}.${image.mimetype.split('/')[1]}`,
    );

    try {
      // Does file exist in permanent or temporary storage?
      if (
        existsSync(fileTargetPath) ||
        existsSync(
          join(this.storePath, `${hash}.${image.mimetype.split('/')[1]}`),
        )
      ) {
        // Image is duplicate => return error along with the hash => no duplicate files
        throw new ConflictException({
          message:
            'This file already seems to be uploaded (indicated by m5hash of file)',
          path: `${hash}.${image.mimetype.split('/')[1]}`,
        } as ImageUploadConflictError);
      }
      // Copy rather than move to allow for "moving" accross devices (i.e. docker volumes)
      this.logger.debug('Promoting image from cache to tmp');
      await copyFile(cachedFilePath, fileTargetPath);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    } finally {
      // Cleanup cache
      await rmSync(cachedFilePath, { force: true });
    }

    try {
      await this.internalCommunicationService.notifyAuthAboutNewImage(
        userJWT,
        `${hash}.${image.mimetype.split('/')[1]}`,
      );
    } catch (error) {
      this.logger.warn(
        `An upload failed because the communication to the  auth backend failed. This could indicate a crashed auth service. ${error}`,
      );
      // A file without an owner is not allowed => cleanup
      rmSync(fileTargetPath);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }

    this.logger.log('Sucesfully uploaded Image with hash: ', hash);
    return { path: `${hash}.${image.mimetype.split('/')[1]}` };
  }

  /**
   * @description Get Hash for file at given path
   */
  async hashFile(filePath: string): Promise<string> {
    if (!existsSync(filePath) || lstatSync(filePath).isDirectory()) {
      throw new Error('Filepath does not lead to file');
    }
    const fileBuffer = await readFile(filePath);
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
    this.logger.debug(`Cropping image ${sourcePath}`);
    if (!existsSync(sourcePath)) {
      throw new InternalServerErrorException(
        'Image could not be found within cache',
      );
    }
    if (lstatSync(sourcePath).isDirectory()) {
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
      await writeFile(sourcePath, buffer);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Image cropping failed');
    }
  }

  /**
   * @description Move image from temporary to permanent storage
   */
  async promoteImage(imageHash: string) {
    this.logger.debug(`Promoting image ${imageHash} from tmp to permanent`);
    const currentPath = join(this.tmpPath, imageHash);
    const targetPath = join(this.storePath, imageHash);
    if (!existsSync(currentPath)) {
      this.logger.log(
        `Image could not be promoted as it was not in temporary storage. This may indicate that the image has already been promoted or deleted. However this is an expected edge case.`,
      );
      return;
    }
    if (existsSync(targetPath)) {
      this.logger.log('Image already exists in promoted form');
      return;
    }
    try {
      this.moveFile(currentPath, targetPath);
    } catch (error) {
      this.logger.error(
        `Image ${imageHash} could not be promoted due to an error ${console.error()}`,
      );
      throw new InternalServerErrorException('Image could not be promoted');
    }
  }

  /**
   * @description Move image from permanent to temporary storage
   */
  async demoteImage(imageHash: string) {
    this.logger.debug(`Demoting image ${imageHash} from permanent to tmp`);
    const currentPath = join(this.storePath, imageHash);
    const targetPath = join(this.tmpPath, imageHash);
    if (!existsSync(currentPath) || existsSync(targetPath)) {
      this.logger.log(`Image demotion failed ${imageHash}`);
      return;
    }
    this.moveFile(currentPath, targetPath);
  }

  /**
   * @description Move image (allow move accross devices)
   */
  private moveFile(source: string, target: string) {
    try {
      // Use this instead of move to allow for "moving" accross devices (i.e. in a docker volume environment)
      copyFileSync(source, target);
      rmSync(source);
    } catch (error) {
      this.logger.error(
        `Move from ${source} to ${target} failed due to an error ${error}`,
      );
      throw new InternalServerErrorException('Image could not be moved');
    }
  }
}
