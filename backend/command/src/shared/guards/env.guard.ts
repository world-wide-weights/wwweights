import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * @description Guard that protects dev endpoints when not in a development environment
 */
@Injectable()
export class ENVGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (process.env.NODE_ENV !== 'development') {
      // not found exception as unauthorized would give away information
      throw new NotFoundException();
    }
    return true;
  }
}
