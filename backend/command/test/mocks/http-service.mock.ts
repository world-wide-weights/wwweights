import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';

/**
 * @description Mock httpservice (currently post only)
 */
export class HttpServiceMock {
  params = [];
  shouldFail = false;

  post(...args: any[]) {
    this.params = args;
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
  }
}
