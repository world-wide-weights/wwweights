import { AuthGuard } from '@nestjs/passport';

/**
 * @description Guard used for validating refresh token
 */
export class RefreshTokenGuard extends AuthGuard('refresh-jwt') {}
