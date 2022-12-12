import { CreateItemDto } from '../../src/commands.module/interfaces/create-item.dto';
import { Item } from '../../src/models/item.model';

export const singleItem: Partial<Item> = {
  name: 'test Name with SpAcEs ',
  slug: 'test-name-with-spaces',
  weight: { value: 1123675e30 },
  tags: ['testTag', 'testTag2'],
  image: null,
  source: 'no source available',
  user: 'testUser',
};

export const createItem: Partial<CreateItemDto> = {
  name: 'test Name with SpAcEs ',
  weight: { value: 1123675e30 },
  user: 'testUser',
};
