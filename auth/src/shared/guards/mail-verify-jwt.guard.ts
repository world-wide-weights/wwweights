import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MailVerifyJWTGuard extends AuthGuard('mail-verify-jwt') {}
