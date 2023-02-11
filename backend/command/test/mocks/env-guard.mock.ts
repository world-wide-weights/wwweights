import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';

export class FakeEnvGuardFactory {
  public isDev = false;

  getGuard() {
    return {
      canActivate: (context: ExecutionContext) => {
        if (!this.isDev) {
          throw new NotFoundException();
        }
        return true;
      },
    };
  }
}
