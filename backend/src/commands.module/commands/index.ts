import { InsertItemHandler } from './insert-item.handler';

// We do this to not overflow the items.module.ts file, there is no need for any other file to import this.
export const CommandHandlers = [InsertItemHandler];
