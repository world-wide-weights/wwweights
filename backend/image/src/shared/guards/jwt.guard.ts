import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @description Guard that verifies access tokens against the auth service
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
