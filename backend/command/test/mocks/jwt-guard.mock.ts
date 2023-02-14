import { ExecutionContext } from '@nestjs/common';

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
