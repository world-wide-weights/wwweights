import { PartialType } from '@nestjs/mapped-types';
import { Item } from '../../models/item.model';

export class SuggestItemUpdateDto extends PartialType(Item) {}
