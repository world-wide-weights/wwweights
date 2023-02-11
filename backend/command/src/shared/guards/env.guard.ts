import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// Used to disable endpoints in production
@Injectable()
export class ENVGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.NODE_ENV !== 'development') {
      // not found exception as unauthorized would give away information
      throw new NotFoundException();
    }
    return true;
  }
}
