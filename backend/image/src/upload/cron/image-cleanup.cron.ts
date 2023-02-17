import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { rmSync, statSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import {
  pathBuilder,
  validateOrCreateDirectory,
} from '../../shared/helpers/file-path.helpers';

const DAY_IN_MS = 86400000;

export class ImageCleanup {
  private tmpPath: string;
  private readonly logger = new Logger(ImageCleanup.name);
  private readonly TMP_FILES_TTL = DAY_IN_MS;

  constructor(private readonly configService: ConfigService) {
    this.tmpPath = pathBuilder(
      this.configService.get<string>('IMAGE_STORE_TMP_PATH'),
      'tmp',
    );
    validateOrCreateDirectory(this.tmpPath);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // Adding a parameter allows for calling this manually and easier testing
  async cleanTmpStage(ttl_in_ms = undefined) {
    const cronStartTime = performance.now();
    const files = await readdir(this.tmpPath);

    const expiredFiles = files.filter(
      (a) =>
        Date.now() - this.getFileMetadata(a).birthtime.getTime() >
        (ttl_in_ms || this.TMP_FILES_TTL),
    );

    for (const file of expiredFiles) {
      try {
        rmSync(join(this.tmpPath, file), { force: true });
      } catch (error) {
        this.logger.error(`file could not be deleted`);
      }
    }
    this.logger.debug(
      `Tmp stage cleanup cronjob took ${performance.now() - cronStartTime}`,
    );
  }

  private getFileMetadata(path) {
    return statSync(join(this.tmpPath, path));
  }
}
