import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
   * @description Send information to backend that an image has been uploaded by an user
   */
  async notifyAuthAboutNewImage(userJwt: string, imageHash: string) {
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
  ) {
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
            throw new InternalServerErrorException(
              'Auth Backend could not be notified!',
            );
          }),
        ),
    );
  }
}
