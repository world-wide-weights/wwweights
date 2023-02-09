import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key']
        const allowedApiKeys = process.env.API_KEYS.split(',')
        return allowedApiKeys.includes(apiKey)
    }
}