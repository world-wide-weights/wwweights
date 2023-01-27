export class Client {
  forcedResult: any[] = [];

  readAll() {
    const g = generator(this.forcedResult.pop());
    // This needs a cancel function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (g as any).cancel = () => {};
    return g;
  }
  subscribeToAll() {
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
