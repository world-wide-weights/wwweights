/**
 * @description Mock eventstore client using js generators
 */
export class Client {
  forcedResult: any[] = [];
  params = [];

  readAll() {
    const g = generator(this.forcedResult.pop());
    // This needs a cancel function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (g as any).cancel = () => {};
    return g;
  }
  subscribeToAll(...args: any[]) {
    this.params = args;
    return generator(this.forcedResult.pop());
  }
}

/**
 * @description Black Magic to simulate eventstore stream output
 */
export function* generator(val: any[]) {
  if (!val) return;
  for (const v of val) {
    yield v;
  }
}
