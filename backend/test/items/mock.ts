import { CreateItemDto } from '../../src/items/interfaces/create-item.dto';
import { Item } from '../../src/items/models/item.model';

export const singleItem: Partial<Item> = {
  id: 1,
  name: 'test Name with SpAcEs ',
  slug: 'test-name-with-spaces',
  value: 1123675e10,
  isCa: true,
  additional_range_value: null,
  tags: ['testTag', 'testTag2'],
  image: null,
  source: 'no source available',
  user: 'testUser',
};

export const createItem: Partial<CreateItemDto> = {
  name: 'test Name with SpAcEs ',
  value: 1123675e10,
  isCa: true,
  additional_range_value: null,
  tags: ['testTag', 'testTag2'],
  image: null,
  source: 'no source available',
  user: 'testUser',
};
