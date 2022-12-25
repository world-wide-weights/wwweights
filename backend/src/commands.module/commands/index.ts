import { CreateItemHandler } from './create-item.handler';

// We do this to not overflow the items.module.ts file, there is no need for any other file to import this.
export const CommandHandlers = [CreateItemHandler];
