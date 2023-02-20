import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

/**
 * @description Service that is responsible for all communication to other services within the wwweights infrastructure
 */
@Injectable()
export class InternalCommunicationService {
  private readonly logger = new Logger(InternalCommunicationService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description Send information to backend that an image is used by item
   */
  async notifyImgAboutItemCreation(imageHash: string): Promise<void> {
    await this.notifyImg('/internal/promote-image', { imageHash });
    this.logger.log('Notifed image backend about image usage');
  }

  /**
   * @description Send information to backend that an image has become obsolete
   */
  async notifyImgAboutImageObsoleteness(imageHash: string): Promise<void> {
    await this.notifyImg('/internal/demote-image', { imageHash });
    this.logger.log('Notifed image backend about image obsoleteness');
  }

  /**
   * @description Send post request to the backend
   */
  private async notifyImg(
    endpoint: string,
    data: { imageHash: string },
  ): Promise<void> {
    await firstValueFrom(
      this.httpService
        .post(
          `${this.configService.get<string>(
            'IMG_BACKEND_BASE_URL',
          )}${endpoint}`,
          data,
          {
            headers: {
              'x-api-key': this.configService.get<string>('IMG_API_KEY'),
            },
          },
        )
        .pipe(
          catchError(
            /* istanbul ignore next */ (error: AxiosError) => {
              this.logger.error(
                `Request to img backend for image ${data.imageHash} failed! Error: ${error}`,
              );
              throw new Error(`Image backend could not be notified`);
            },
          ),
        ),
    );
  }
}
