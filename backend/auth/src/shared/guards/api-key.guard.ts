import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @description Guard that checks whether a given api key is in a list of allowed
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const allowedApiKeys = this.configService.get<string>('API_KEYS')?
          .split(',') || []
    return allowedApiKeys.includes(apiKey);
  }
}
