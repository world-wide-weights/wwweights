import { NotFoundException } from '@nestjs/common';

/**
 * @description produces a fake env guard that can be controlled as you wish, master
 */
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
