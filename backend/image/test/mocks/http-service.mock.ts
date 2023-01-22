export class HttpServiceMock {
  params = [];
  shouldFail = false;

  post(...args: any[]) {
    this.params = args;
    if (this.shouldFail) {
      throw new Error('Oh no! The icecream machine has stopped working');
    }
  }

  reset() {
    this.params = [];
    this.shouldFail = false;
  }
}
