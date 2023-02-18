import { prop } from '@typegoose/typegoose';
import { EditSuggestion } from './edit-suggestion.model';

export class ProfileCounts {
  @prop()
  itemsCreated: number;

  @prop()
  itemsUpdated: number;

  @prop()
  tagsUsedOnCreation: number;

  @prop()
  tagsUsedOnUpdate: number;

  @prop()
  sourceUsedOnCreation: number;

  @prop()
  sourceUsedOnUpdate: number;

  @prop()
  imageAddedOnCreation: number;

  @prop()
  imageAddedOnUpdate: number;

  @prop()
  additionalValueOnCreation: number;

  @prop()
  additionalValueOnUpdate: number;

  @prop()
  itemsDeleted: number;
}
export class Profile {
  @prop({ required: true, unique: true })
  userId: number;

  @prop({ type: () => ProfileCounts, _id: false })
  count: ProfileCounts;

  @prop({ array: true, type: () => [EditSuggestion] })
  suggestions: EditSuggestion[];
  // Since we currently don't look for items and suggestions created, we omit this.
  // But we can always fetch them by adding an index in items on the userId and then looking for matches over the item/suggestion collection.
}
