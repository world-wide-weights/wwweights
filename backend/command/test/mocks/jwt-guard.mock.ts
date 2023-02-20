import { ExecutionContext } from '@nestjs/common';

/**
 * @description Produce a fake jwt guard that can be commanded at will
 */
export class FakeAuthGuardFactory {
  private user;
  private authorizeRequests = true;

  setUser(user) {
    this.user = user;
  }

  setAuthResponse(bool: boolean) {
    this.authorizeRequests = bool;
  }

  getGuard() {
    return {
      canActivate: (context: ExecutionContext) => {
        context.switchToHttp().getRequest().user = this.user;
        return this.authorizeRequests;
      },
    };
  }
}
