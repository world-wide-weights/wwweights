import { Item } from '../models/item.model';

// Using Pick instead of Partial (makes everything optional)
export class CreateItemDto extends Item {}
