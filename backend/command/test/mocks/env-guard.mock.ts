import { NotFoundException } from '@nestjs/common';

export class FakeEnvGuardFactory {
  public isDev = false;

  getGuard() {
    return {
      canActivate: () => {
        if (!this.isDev) {
          throw new NotFoundException();
        }
        return true;
      },
    };
  }
}
