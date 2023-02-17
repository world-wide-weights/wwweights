import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';

export class HttpServiceMock {
  private params: any[] = [];
  shouldFail = false;
  hasBeenCalled = false;

  post(...args: any[]) {
    this.params.push(...args);
    this.hasBeenCalled = true;
    console.log('called', this.params);
    if (this.shouldFail) {
      return throwError(
        () =>
          new Error(
            'Oh no! The icecream machine has stopped working',
          ) as AxiosError,
      );
    }
    // Mock successfull axios post
    return of({
      data: {},
      status: HttpStatus.CREATED,
      statusText: 'CREATED',
      headers: {},
    });
  }

  reset() {
    this.params = [];
    this.shouldFail = false;
    this.hasBeenCalled = false;
  }

  getParams() {
    return [...this.params];
  }
}
