import { AuthGuard } from '@nestjs/passport';

export class ResetJWTGuard extends AuthGuard('reset-jwt') {}
