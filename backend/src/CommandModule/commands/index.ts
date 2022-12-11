import { CreateItemHandler } from './create-item.handler';
import { TestItemSagaHandler } from './test-item-saga.handler';

// We do this to not overflow the items.module.ts file, there is no need for any other file to import this, so we can do this "bad" practice
export const CommandHandlers = [CreateItemHandler, TestItemSagaHandler];
