import { DeleteItemHandler } from './delete-item.handler';
import { EditItemHandler } from './edit-item.handler';
import { InsertItemHandler } from './insert-item.handler';
import { SuggestItemDeleteHandler } from './suggest-item-delete.handler';
import { SuggestItemEditHandler } from './suggest-item-edit.handler';

// We do this to not overflow the items.module.ts file, there is no need for any other file to import this.
export const ItemCommandHandlers = [
  InsertItemHandler,
  SuggestItemEditHandler,
  SuggestItemDeleteHandler,
  EditItemHandler,
  DeleteItemHandler,
];
