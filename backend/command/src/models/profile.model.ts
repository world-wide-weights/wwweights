import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { Item } from './item.model';
import { EditSuggestion } from './suggestion.model';

export class Profile {
  @Expose()
  @prop({ required: true, unique: true })
  username: string;

  // TODO: Add rest

  @Expose()
  @prop({ array: true, type: () => [Item] })
  items: Item[];

  @Expose()
  @prop({ array: true, type: () => [EditSuggestion] })
  suggestions: EditSuggestion[];
}
