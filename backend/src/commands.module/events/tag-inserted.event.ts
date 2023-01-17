import { Tag } from '../../models/tag.model';

export class TagInsertedEvent {
  constructor(public readonly tag: Tag) {}
}
