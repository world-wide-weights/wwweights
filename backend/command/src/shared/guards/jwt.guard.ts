import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description Guard for verifying access tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
