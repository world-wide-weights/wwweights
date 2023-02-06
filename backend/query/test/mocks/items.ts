export const relatedItems = [...Array(3).keys()].map((index) => ({
  _id: 'aaaaaaaaaaaaaaaaaaaaaaa' + index,
  name: 'matching ' + index,
  slug: 'matching-' + index,
  weight: {
    value: 100 + index,
  },
  tags: [{ name: 'matching', count: 3 }],
  user: 'md',
}));

export const time = 1674412369090;
export const itemsWithDates = Array.from({ length: 20 }, (_, i) => i + 10).map(
  (index) => ({
    _id: 'aaaaaaaaaaaaaaaaaaaaaa' + index,
    name: 'item ' + index,
    slug: 'item-' + index,
    weight: {
      value: 100 + index,
    },
    tags: [{ name: 'item', count: 20 }],
    user: 'md',
    createdAt: time + index,
  }),
);

export const items = [
  {
    _id: '63cd54ad24dd59ab4088faf5',
    name: 'Vienna LTE Dual SIM',
    slug: 'vienna-lte-dual-sim',
    weight: {
      value: 156,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088faf7',
    name: 'P9 Premium Edition Dual SIM TD-LTE EVA-AL10',
    slug: 'p9-premium-edition-dual-sim-td-lte-eva-al10',
    weight: {
      value: 144,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088fb08',
    name: 'P9 Plus Dual SIM TD-LTE VIE-L29',
    slug: 'p9-plus-dual-sim-td-lte-vie-l29',
    weight: {
      value: 162,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 16',
        count: 5,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088fb1b',
    name: 'P9 Premium Edition Dual SIM TD-LTE EVA-L29',
    slug: 'p9-premium-edition-dual-sim-td-lte-eva-l29',
    weight: {
      value: 144,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 16',
        count: 5,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088fb1d',
    name: 'Eluga Arc Dual SIM TD-LTE',
    slug: 'eluga-arc-dual-sim-td-lte',
    weight: {
      value: 130,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'panasonic',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088fb1f',
    name: 'SM-J700T Galaxy J7 4G LTE',
    slug: 'sm-j700t-galaxy-j7-4g-lte',
    weight: {
      value: 171,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'samsung',
        count: 5,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: '2016 may 18',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ad24dd59ab4088fb3c',
    name: 'F7 Pro Dual SIM LTE',
    slug: 'f7-pro-dual-sim-lte',
    weight: {
      value: 180,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: 'doogee',
        count: 1,
      },
      {
        name: '2016 feb 28',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb4f',
    name: 'F690L X Series X Cam 4G LTE',
    slug: 'f690l-x-series-x-cam-4g-lte',
    weight: {
      value: 118,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2016 jun 29',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb51',
    name: 'P9 Plus TD-LTE VIE-L09',
    slug: 'p9-plus-td-lte-vie-l09',
    weight: {
      value: 162,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb55',
    name: 'SM-J710K Galaxy J7 6 LTE-A KR 16GB / Galaxy J7 2016',
    slug: 'sm-j710k-galaxy-j7-6-lte-a-kr-16gb-galaxy-j7-2016',
    weight: {
      value: 169,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'samsung',
        count: 5,
      },
      {
        name: '2016 apr 29',
        count: 3,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb76',
    name: 'M930',
    slug: 'm930',
    weight: {
      value: 158,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'asus',
        count: 2,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'microsoft windows mobile 6 standard crossbow',
        count: 1,
      },
      {
        name: '2008 may 18',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb78',
    name: 'Y6 LTE JP SCL-L02',
    slug: 'y6-lte-jp-scl-l02',
    weight: {
      value: 155,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: '2016 apr 16',
        count: 5,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb7a',
    name: 'C Dual SIM LTE / Aqua Fish',
    slug: 'c-dual-sim-lte-aqua-fish',
    weight: {
      value: 150,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'jolla',
        count: 1,
      },
      {
        name: 'linux',
        count: 1,
      },
      {
        name: 'jolla sailfish os 20 eineheminlampi',
        count: 1,
      },
      {
        name: '2016 jul',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fb99',
    name: 'm3 note Dual SIM TD-LTE 16GB M681C / M681Q',
    slug: 'm3-note-dual-sim-td-lte-16gb-m681c-m681q',
    weight: {
      value: 163,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'meizu',
        count: 2,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2016 apr 24',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fba8',
    name: 'GR3 Dual SIM LTE TAG-L21 / Enjoy 5S',
    slug: 'gr3-dual-sim-lte-tag-l21-enjoy-5s',
    weight: {
      value: 135,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbb7',
    name: 'H960AR V10 TD-LTE',
    slug: 'h960ar-v10-td-lte',
    weight: {
      value: 192,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2015 dec',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbc3',
    name: 'D693AR G3 Stylus',
    slug: 'd693ar-g3-stylus',
    weight: {
      value: 173,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 442 kitkat',
        count: 2,
      },
      {
        name: '2014 oct',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbd0',
    name: 'X150 L Bello II',
    slug: 'x150-l-bello-ii',
    weight: {
      value: 155,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2015 jun',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbde',
    name: 'H540F G Stylus Dual SIM',
    slug: 'h540f-g-stylus-dual-sim',
    weight: {
      value: 162,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 502 lollipop',
        count: 3,
      },
      {
        name: '2015 jul 4',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbe0',
    name: 'G5 LS992 TD-LTE US',
    slug: 'g5-ls992-td-lte-us',
    weight: {
      value: 159,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'lg',
        count: 20,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbe2',
    name: 'P9 Standard Edition TD-LTE EVA-L09',
    slug: 'p9-standard-edition-td-lte-eva-l09',
    weight: {
      value: 144,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 16',
        count: 5,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fbfe',
    name: 'P4300',
    slug: 'p4300',
    weight: {
      value: 168,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'htc',
        count: 6,
      },
      {
        name: 'microsoft windows mobile 50 for pocket pc phone edition magneto',
        count: 3,
      },
      {
        name: '2006 jan',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc12',
    name: 'Digno 501KC LTE',
    slug: 'digno-501kc-lte',
    weight: {
      value: 130,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: '2015 dec',
        count: 2,
      },
      {
        name: 'kyocera',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc14',
    name: 'K430TV K Series K10 TV Dual SIM LTE',
    slug: 'k430tv-k-series-k10-tv-dual-sim-lte',
    weight: {
      value: 153,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2016 feb 14',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc16',
    name: 'G5 US992 LTE-A',
    slug: 'g5-us992-lte-a',
    weight: {
      value: 159,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'lg',
        count: 20,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc39',
    name: 'A53 Dual SIM TD-LTE A53c',
    slug: 'a53-dual-sim-td-lte-a53c',
    weight: {
      value: 165,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: 'oppo',
        count: 4,
      },
      {
        name: '2016 mar',
        count: 4,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc3b',
    name: 'R9 Dual SIM TD-LTE 64GB R9tm',
    slug: 'r9-dual-sim-td-lte-64gb-r9tm',
    weight: {
      value: 145,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: 'oppo',
        count: 4,
      },
      {
        name: '2016 apr 2',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc3d',
    name: 'R9 Plus Dual SIM TD-LTE 64GB R9 Plustm',
    slug: 'r9-plus-dual-sim-td-lte-64gb-r9-plustm',
    weight: {
      value: 185,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: 'oppo',
        count: 4,
      },
      {
        name: '2016 apr 12',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc5b',
    name: 'BA510C Yuanhang 4 TD-LTE Dual SIM',
    slug: 'ba510c-yuanhang-4-td-lte-dual-sim',
    weight: {
      value: 130,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'zte',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc6a',
    name: 'P9 Standard Edition Dual SIM TD-LTE EVA-DL00',
    slug: 'p9-standard-edition-dual-sim-td-lte-eva-dl00',
    weight: {
      value: 144,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc7a',
    name: 'LIFE S5004 MD99722 LTE Dual SIM',
    slug: 'life-s5004-md99722-lte-dual-sim',
    weight: {
      value: 128,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: '2016 mar',
        count: 4,
      },
      {
        name: 'medion',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc7c',
    name: 'VPA Compact S',
    slug: 'vpa-compact-s',
    weight: {
      value: 148,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'microsoft windows mobile 50 for pocket pc phone edition magneto',
        count: 3,
      },
      {
        name: 'vodafone',
        count: 1,
      },
      {
        name: '2006 jun',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc82',
    name: '10 LTE-A NA 32GB',
    slug: '10-lte-a-na-32gb',
    weight: {
      value: 161,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 29',
        count: 3,
      },
      {
        name: 'htc',
        count: 6,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fc9c',
    name: '10 Lifestyle TD-LTE M10u',
    slug: '10-lifestyle-td-lte-m10u',
    weight: {
      value: 161,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'htc',
        count: 6,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fca4',
    name: 'One Touch Pop 4S LTE 5095L 32GB',
    slug: 'one-touch-pop-4s-lte-5095l-32gb',
    weight: {
      value: 150,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 mar',
        count: 4,
      },
      {
        name: 'alcatel',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54ae24dd59ab4088fcb9',
    name: '10 TD-LTE JP 32GB',
    slug: '10-td-lte-jp-32gb',
    weight: {
      value: 161,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'htc',
        count: 6,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fcc8',
    name: '5367 Dual SIM TD-LTE',
    slug: '5367-dual-sim-td-lte',
    weight: {
      value: 130,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'coolpad',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fcd5',
    name: 'Quattro L51 HD TD-LTE Dual SIM',
    slug: 'quattro-l51-hd-td-lte-dual-sim',
    weight: {
      value: 125,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'karbonn',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fce1',
    name: 'GR5 Dual SIM LTE KII-L23',
    slug: 'gr5-dual-sim-lte-kii-l23',
    weight: {
      value: 158,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2016 mar',
        count: 4,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fcef',
    name: 'Hydro REACH C6743 TD-LTE US',
    slug: 'hydro-reach-c6743-td-lte-us',
    weight: {
      value: 141,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: 'kyocera',
        count: 2,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fcf1',
    name: 'C6 / P6',
    slug: 'c6-p6',
    weight: {
      value: 79,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'roverpc',
        count: 1,
      },
      {
        name: 'microsoft windows mobile 6 professional crossbow',
        count: 2,
      },
      {
        name: '2007 dec',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fcf5',
    name: 'SM-W708 Galaxy TabPro S LTE-A 256GB',
    slug: 'sm-w708-galaxy-tabpro-s-lte-a-256gb',
    weight: {
      value: 693,
    },
    tags: [
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'samsung',
        count: 5,
      },
      {
        name: 'windows desktopclass',
        count: 1,
      },
      {
        name: 'microsoft windows 10 pro',
        count: 1,
      },
      {
        name: 'tablet',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd12',
    name: 'SM-T377W Galaxy Tab E 8.0 4G LTE',
    slug: 'sm-t377w-galaxy-tab-e-80-4g-lte',
    weight: {
      value: 360,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'samsung',
        count: 5,
      },
      {
        name: 'tablet',
        count: 2,
      },
      {
        name: '2016 jun 6',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd23',
    name: 'm3 M688Q Dual SIM TD-LTE 16GB',
    slug: 'm3-m688q-dual-sim-td-lte-16gb',
    weight: {
      value: 132,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'meizu',
        count: 2,
      },
      {
        name: '2016 may',
        count: 12,
      },
      {
        name: 'alibaba yunos 316',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd25',
    name: 'K332 K Series K7 Dual SIM TD-LTE',
    slug: 'k332-k-series-k7-dual-sim-td-lte',
    weight: {
      value: 141,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2016 apr 18',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd3d',
    name: 'P9 Standard Edition Dual SIM TD-LTE EVA-TL00',
    slug: 'p9-standard-edition-dual-sim-td-lte-eva-tl00',
    weight: {
      value: 144,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd3f',
    name: 'ZenFone Max Dual SIM Global LTE ZC550KL 16GB',
    slug: 'zenfone-max-dual-sim-global-lte-zc550kl-16gb',
    weight: {
      value: 202,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'asus',
        count: 2,
      },
      {
        name: 'google android 502 lollipop',
        count: 3,
      },
      {
        name: '2016 jan 14',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd43',
    name: 'P9 Lite Dual SIM LTE VNS-L23',
    slug: 'p9-lite-dual-sim-lte-vns-l23',
    weight: {
      value: 143,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd56',
    name: 'Quattro L52 VR TD-LTE Dual SIM',
    slug: 'quattro-l52-vr-td-lte-dual-sim',
    weight: {
      value: 143,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'karbonn',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd64',
    name: 'ivvi i3 i3-01 Dual SIM LTE 64GB',
    slug: 'ivvi-i3-i3-01-dual-sim-lte-64gb',
    weight: {
      value: 140,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 29',
        count: 3,
      },
      {
        name: 'coolpad',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd7b',
    name: 'P4351',
    slug: 'p4351',
    weight: {
      value: 168,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'htc',
        count: 6,
      },
      {
        name: 'microsoft windows mobile 6 professional crossbow',
        count: 2,
      },
      {
        name: '2007 jun',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd8b',
    name: 'GN3001 Elife S5 TD-LTE',
    slug: 'gn3001-elife-s5-td-lte',
    weight: {
      value: 163,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'gionee',
        count: 2,
      },
      {
        name: '2016 may 16',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd8d',
    name: 'Y5II CUN-L23 Dual SIM LTE LATAM',
    slug: 'y5ii-cun-l23-dual-sim-lte-latam',
    weight: {
      value: 135,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fd8f',
    name: 'GR5 LTE KII-L05',
    slug: 'gr5-lte-kii-l05',
    weight: {
      value: 158,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdb2',
    name: 'K540 K Series Stylo 2 4G LTE',
    slug: 'k540-k-series-stylo-2-4g-lte',
    weight: {
      value: 145,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2016 apr 21',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdb4',
    name: 'G5 H830 LTE-A US',
    slug: 'g5-h830-lte-a-us',
    weight: {
      value: 155,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2016 mar 19',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdc8',
    name: 'AS330 K Series K7 LTE',
    slug: 'as330-k-series-k7-lte',
    weight: {
      value: 159,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdd8',
    name: 'Z818L Allstar Stratos LTE / Z818G',
    slug: 'z818l-allstar-stratos-lte-z818g',
    weight: {
      value: 172,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'zte',
        count: 2,
      },
      {
        name: '2015 nov 3',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fde5',
    name: 'RS987 V10 LRA LTE-A',
    slug: 'rs987-v10-lra-lte-a',
    weight: {
      value: 192,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 511 lollipop',
        count: 13,
      },
      {
        name: '2016 jan',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdf3',
    name: 'SM-G389F Galaxy Xcover 3 Value Edition',
    slug: 'sm-g389f-galaxy-xcover-3-value-edition',
    weight: {
      value: 154,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 apr 16',
        count: 5,
      },
      {
        name: 'samsung',
        count: 5,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdf5',
    name: 'A9100',
    slug: 'a9100',
    weight: {
      value: 168,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'microsoft windows mobile 50 for pocket pc phone edition magneto',
        count: 3,
      },
      {
        name: 'qtek',
        count: 1,
      },
      {
        name: '2006 mar',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdf7',
    name: 'G5 RS988 LTE-A',
    slug: 'g5-rs988-lte-a',
    weight: {
      value: 159,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'lg',
        count: 20,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54af24dd59ab4088fdf9',
    name: 'Y3II 4G LTE LUA-L01 / Y3 II Eco',
    slug: 'y3ii-4g-lte-lua-l01-y3-ii-eco',
    weight: {
      value: 150,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe1e',
    name: 'F720K Stylus 2 4G LTE',
    slug: 'f720k-stylus-2-4g-lte',
    weight: {
      value: 145,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2016 mar 11',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe36',
    name: 'A37 Dual SIM TD-LTE CN A37m',
    slug: 'a37-dual-sim-td-lte-cn-a37m',
    weight: {
      value: 143,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'oppo',
        count: 4,
      },
      {
        name: '2016 may 17',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe34',
    name: 'G9 Dual SIM TD-LTE VNS-DL00 / G9 Youth Edition',
    slug: 'g9-dual-sim-td-lte-vns-dl00-g9-youth-edition',
    weight: {
      value: 143,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may',
        count: 12,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe4e',
    name: 'HS-F30 TD-LTE',
    slug: 'hs-f30-td-lte',
    weight: {
      value: 140,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 60 marshmallow',
        count: 6,
      },
      {
        name: '2016 may',
        count: 12,
      },
      {
        name: 'hisense',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe5a',
    name: 'Z2 Pro Ultimate Edition TD-LTE Dual SIM 128GB',
    slug: 'z2-pro-ultimate-edition-td-lte-dual-sim-128gb',
    weight: {
      value: 145,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'zuk',
        count: 1,
      },
      {
        name: '2016 may 29',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe68',
    name: 'GN9011L Elife S8 Dual SIM TD-LTE 64GB',
    slug: 'gn9011l-elife-s8-dual-sim-td-lte-64gb',
    weight: {
      value: 147,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: '2016 apr',
        count: 15,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: 'gionee',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe6a',
    name: 'S411',
    slug: 's411',
    weight: {
      value: 105,
    },
    tags: [
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'windows mobileclass',
        count: 7,
      },
      {
        name: 'htc',
        count: 6,
      },
      {
        name: 'microsoft windows mobile 50 for smartphone',
        count: 1,
      },
      {
        name: '2006 aug',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe6c',
    name: 'Honor V8 Premium Edition Dual SIM TD-LTE 64GB KNT-AL20',
    slug: 'honor-v8-premium-edition-dual-sim-td-lte-64gb-knt-al20',
    weight: {
      value: 170,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'huawei',
        count: 16,
      },
      {
        name: 'google android 601 marshmallow',
        count: 26,
      },
      {
        name: '2016 may 17',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe86',
    name: 'AS995 G Flex2 ACG LTE-A',
    slug: 'as995-g-flex2-acg-lte-a',
    weight: {
      value: 152,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 502 lollipop',
        count: 3,
      },
      {
        name: '2015 apr',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe9c',
    name: 'MS631 G Stylo LTE',
    slug: 'ms631-g-stylo-lte',
    weight: {
      value: 163,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'google android 51 lollipop',
        count: 14,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: '2015 jun',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fe9e',
    name: 'G3 AS990 ACG LTE-A',
    slug: 'g3-as990-acg-lte-a',
    weight: {
      value: 149,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 442 kitkat',
        count: 2,
      },
      {
        name: '2014 sep',
        count: 1,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088feaa',
    name: 'L21G Destiny HSPA',
    slug: 'l21g-destiny-hspa',
    weight: {
      value: 139,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 501 lollipop',
        count: 2,
      },
      {
        name: '2015 sep',
        count: 2,
      },
    ],
    user: 'mc',
  },
  {
    _id: '63cd54b024dd59ab4088fec3',
    name: 'L22C Power CDMA',
    slug: 'l22c-power-cdma',
    weight: {
      value: 139,
    },
    tags: [
      {
        name: 'android',
        count: 67,
      },
      {
        name: 'smartphone',
        count: 74,
      },
      {
        name: 'lg',
        count: 20,
      },
      {
        name: 'google android 501 lollipop',
        count: 2,
      },
      {
        name: '2015 sep',
        count: 2,
      },
    ],
    user: 'mc',
  },
];

export const itemsTagCount = () => {
  const tagNames = items.map((item) => item.tags.map((tag) => tag.name)).flat();

  const tagNameSet = new Set(tagNames);
  return tagNameSet.size;
};
