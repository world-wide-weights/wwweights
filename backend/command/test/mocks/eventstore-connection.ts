import { StreamNotFoundError } from '@eventstore/db-client';

/**
 * @description Mock eventstore client using js generators
 */
export class Client {
  forcedResult: any[] = [];
  params = [];
  simulateNonExistingStream = false;

  /**
   * @description Return values from forcedResult via generator
   */
  readAll(): Generator {
    let g = generator(this.forcedResult.pop());
    if (this.simulateNonExistingStream) {
      g = errorGenerator();
    }

    // This needs a cancel function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (g as any).cancel = () => {};
    return g;
  }

  /**
   * @description Return values from forcedResult via generator
   */
  subscribeToAll(...args: any[]): Generator {
    this.params = args;
    if (this.simulateNonExistingStream) {
      return errorGenerator();
    }
    return generator(this.forcedResult.pop());
  }

  /**
   * @description Return values from forcedResult via generator
   */
  readStream(): Generator {
    let g = generator(this.forcedResult.pop());
    if (this.simulateNonExistingStream) {
      g = errorGenerator();
    }

    // This needs a cancel function
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (g as any).cancel = () => {};
    return g;
  }

  /**
   * @description Take and save params
   */
  async appendToStream(...args: any[]): Promise<void> {
    this.params = args;
    return;
  }

  /**
   * @description Reset client mock
   */
  reset(): void {
    this.forcedResult = [];
    this.params = [];
    this.simulateNonExistingStream = false;
  }
}

/**
 * @description Black Magic to simulate eventstore stream output
 */
export function* generator(val: any[]): Generator {
  if (!val) return;
  for (const v of val) {
    yield v;
  }
}

/**
 * @description Black Magic to simulate eventstore failure output
 */
export function* errorGenerator(): Generator {
  throw new StreamNotFoundError();
}
