import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @description Service that is responsible for all communication to other services within the wwweights infrastructure
 */
@Injectable()
export class InternalCommunicationService {
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
  }

  /**
   * @description Send post request to the backend
   */
  private async notifyAuth(
    endpoint: string,
    data: never | { imageHash: string },
    headers: Record<string, string>,
  ) {
    try {
      await this.httpService.post(
        `${this.configService.getOrThrow<string>(
          'AUTH_BACKEND_BASE_URL',
        )}${endpoint}`,
        data,
        {
          headers: headers,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Auth Backend could not be notified!',
      );
    }
  }
}
