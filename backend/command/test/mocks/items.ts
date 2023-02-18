import { Tag } from 'src/models/tag.model';
import { InsertItemDto } from '../../src/controllers/interfaces/insert-item.dto';
import { Item } from '../../src/models/item.model';

export const singleItem: Partial<Item> = {
  name: 'test Name with SpAcEs ',
  slug: 'test-name-with-spaces',
  weight: { value: 1123675e30 },
  tags: [
    { name: 'testTagName', count: 1 },
    { name: 'testTagName2', count: 1 },
  ],
  image: null,
  source: 'no source available',
  userId: 1,
};

export const singleItemTags: Partial<Tag>[] = [
  { name: 'testTagName', count: 1 },
  { name: 'testTagName2', count: 1 },
];

export const insertItem: Partial<InsertItemDto> = {
  name: 'test Name with SpAcEs ',
  weight: { value: 1123675e30 },
  tags: ['tag1', 'tag2'],
};

export const insertItem2: Partial<InsertItemDto> = {
  name: 'test2',
  weight: { value: 1123675e30 },
  tags: ['tag1'],
};

export const insertItemWithAllValues: Partial<InsertItemDto> = {
  name: 'test2',
  weight: { value: 1123675e30, isCa: false, additionalValue: 1123675e33 },
  tags: ['tag1', 'tag2'],
  image: 'https://www.google.com',
  source: 'https://www.google.com',
};

export const differentNames = [...Array(20).keys()];

export const testData = [
  {
    name: 'Vienna LTE Dual SIM',
    weight: {
      value: 156,
    },
    tags: [
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
  },
  {
    name: 'P9 Premium Edition Dual SIM TD-LTE EVA-AL10',
    weight: {
      value: 144,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
  },
  {
    name: 'P9 Plus Dual SIM TD-LTE VIE-L29',
    weight: {
      value: 162,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 16',
      'Smartphone',
    ],
  },
  {
    name: 'P9 Premium Edition Dual SIM TD-LTE EVA-L29',
    weight: {
      value: 144,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 16',
      'Smartphone',
    ],
  },
  {
    name: 'Eluga Arc Dual SIM TD-LTE',
    weight: {
      value: 130,
    },
    tags: [
      'Panasonic',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
  },
  {
    name: 'SM-J700T Galaxy J7 4G LTE',
    weight: {
      value: 171,
    },
    tags: [
      'Samsung',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 May 18',
      'Smartphone',
    ],
  },
];

export const bulkInsertData = [...Array(5).keys()].map((ind) => ({
  ...testData[ind],
  tags: [...testData[ind].tags, `trackertag${ind}`],
}));

export const trackerTags = [...Array(5).keys()].map(
  (ind) => `trackertag${ind}`,
);
