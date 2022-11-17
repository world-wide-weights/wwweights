import { CreateItemDto } from '../../src/items/interfaces/create-item.dto';
import { Item } from '../../src/items/models/item.model';
type ItemWithoutFunctions = Omit<Item, 'applySlug'>;

export const singleItem: ItemWithoutFunctions = {
  id: 1,
  name: 'test Name with SpAcEs ',
  slug: 'test-name-with-spaces',
  value: '1kg',
  is_ca: true,
  additional_range_value: null,
  tags: ['testTag', 'testTag2'],
  image: null,
  source: 'no source available',
  user: 'testUser',
  related: null,
  isActive: true,
};

export const createItem: CreateItemDto = {
  name: 'test Name with SpAcEs ',
  value: '1kg',
  is_ca: true,
  additional_range_value: null,
  tags: ['testTag', 'testTag2'],
  image: null,
  source: 'no source available',
  user: 'testUser',
};
