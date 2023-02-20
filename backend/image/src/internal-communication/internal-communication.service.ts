import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class InternalCommunicationService {
  private readonly logger = new Logger(InternalCommunicationService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @description Send information to backend that an image has been uploaded by an user
   */
  async notifyAuthAboutNewImage(
    userJwt: string,
    imageHash: string,
  ): Promise<void> {
    await this.notifyAuth(
      '/account/add-image',
      { imageHash },
      { Authorization: userJwt },
    );
    this.logger.log('Notifed Auth backend about new image upload by user');
  }

  /**
   * @description Send post request to the backend
   */
  private async notifyAuth(
    endpoint: string,
    data: never | { imageHash: string },
    headers: Record<string, string>,
  ): Promise<void> {
    await firstValueFrom(
      this.httpService
        .post(
          `${this.configService.get<string>(
            'AUTH_BACKEND_BASE_URL',
          )}${endpoint}`,
          data,
          {
            headers: {
              ...headers,
              'x-api-key': this.configService.get<string>('AUTH_API_KEY'),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Request to auth backend failed! Error: ${error}`,
            );
            throw new ServiceUnavailableException(
              'Auth Backend could not be notified at the time',
            );
          }),
        ),
    );
  }
}
