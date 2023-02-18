import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * @description Guard that checks whether a given api key is in a list of allowed
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const allowedApiKeys = process.env.API_KEYS.split(',');
    return allowedApiKeys.includes(apiKey);
  }
}
