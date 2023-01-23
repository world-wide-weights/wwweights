import { InsertItemDto } from '../../src/items/interfaces/insert-item.dto';
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
  user: 'testUser',
};

export const insertItem: Partial<InsertItemDto> = {
  name: 'test Name with SpAcEs ',
  weight: { value: 1123675e30 },
  user: 'testUser',
  tags: ['tag1', 'tag2'],
};

export const insertItem2: Partial<InsertItemDto> = {
  name: 'test2',
  weight: { value: 1123675e30 },
  user: 'testUser',
  tags: ['tag1'],
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
    user: 'mc',
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
    user: 'mc',
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
    user: 'mc',
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
    user: 'mc',
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
    user: 'mc',
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
    user: 'mc',
  },
  {
    name: 'F7 Pro Dual SIM LTE',
    weight: {
      value: 180,
    },
    tags: [
      'Doogee',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 Feb 28',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'F690L X Series X Cam 4G LTE',
    weight: {
      value: 118,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 Jun 29',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P9 Plus TD-LTE VIE-L09',
    weight: {
      value: 162,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'SM-J710K Galaxy J7 6 LTE-A KR 16GB / Galaxy J7 2016',
    weight: {
      value: 169,
    },
    tags: [
      'Samsung',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 29',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'M930',
    weight: {
      value: 158,
    },
    tags: [
      'Asus',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 6 Standard (Crossbow)',
      '2008 May 18',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Y6 LTE JP SCL-L02',
    weight: {
      value: 155,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr 16',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'C Dual SIM LTE / Aqua Fish',
    weight: {
      value: 150,
    },
    tags: [
      'Jolla',
      'Linux',
      'Jolla Sailfish OS 2.0 (Eineheminlampi)',
      '2016 Jul',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'm3 note Dual SIM TD-LTE 16GB M681C / M681Q',
    weight: {
      value: 163,
    },
    tags: [
      'Meizu',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr 24',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'GR3 Dual SIM LTE TAG-L21 / Enjoy 5S',
    weight: {
      value: 135,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'H960AR V10 TD-LTE',
    weight: {
      value: 192,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2015 Dec',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'D693AR G3 Stylus',
    weight: {
      value: 173,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 4.4.2 (KitKat)',
      '2014 Oct',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'X150 L Bello II',
    weight: {
      value: 155,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2015 Jun',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'H540F G Stylus Dual SIM',
    weight: {
      value: 162,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.0.2 (Lollipop)',
      '2015 Jul 4',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G5 LS992 TD-LTE US',
    weight: {
      value: 159,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P9 Standard Edition TD-LTE EVA-L09',
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
    user: 'mc',
  },
  {
    name: 'P4300',
    weight: {
      value: 168,
    },
    tags: [
      'HTC',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 5.0 for Pocket PC Phone Edition (Magneto)',
      '2006 Jan',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Digno 501KC LTE',
    weight: {
      value: 130,
    },
    tags: [
      'Kyocera',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2015 Dec',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'K430TV K Series K10 TV Dual SIM LTE',
    weight: {
      value: 153,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 Feb 14',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G5 US992 LTE-A',
    weight: {
      value: 159,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'A53 Dual SIM TD-LTE A53c',
    weight: {
      value: 165,
    },
    tags: [
      'Oppo',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Mar',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'R9 Dual SIM TD-LTE 64GB R9tm',
    weight: {
      value: 145,
    },
    tags: [
      'Oppo',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr 2',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'R9 Plus Dual SIM TD-LTE 64GB R9 Plustm',
    weight: {
      value: 185,
    },
    tags: [
      'Oppo',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr 12',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'BA510C Yuanhang 4 TD-LTE Dual SIM',
    weight: {
      value: 130,
    },
    tags: [
      'ZTE',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P9 Standard Edition Dual SIM TD-LTE EVA-DL00',
    weight: {
      value: 144,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'LIFE S5004 MD99722 LTE Dual SIM',
    weight: {
      value: 128,
    },
    tags: [
      'Medion',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Mar',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'VPA Compact S',
    weight: {
      value: 148,
    },
    tags: [
      'Vodafone',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 5.0 for Pocket PC Phone Edition (Magneto)',
      '2006 Jun',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: '10 LTE-A NA 32GB',
    weight: {
      value: 161,
    },
    tags: [
      'HTC',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 29',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: '10 Lifestyle TD-LTE M10u',
    weight: {
      value: 161,
    },
    tags: [
      'HTC',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'One Touch Pop 4S LTE 5095L 32GB',
    weight: {
      value: 150,
    },
    tags: [
      'Alcatel',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Mar',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: '10 TD-LTE JP 32GB',
    weight: {
      value: 161,
    },
    tags: [
      'HTC',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: '5367 Dual SIM TD-LTE',
    weight: {
      value: 130,
    },
    tags: [
      'Coolpad',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Quattro L51 HD TD-LTE Dual SIM',
    weight: {
      value: 125,
    },
    tags: [
      'Karbonn',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'GR5 Dual SIM LTE KII-L23',
    weight: {
      value: 158,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Mar',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Hydro REACH C6743 TD-LTE US',
    weight: {
      value: 141,
    },
    tags: [
      'Kyocera',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'C6 / P6',
    weight: {
      value: 79,
    },
    tags: [
      'RoverPC',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 6 Professional (Crossbow)',
      '2007 Dec',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'SM-W708 Galaxy TabPro S LTE-A 256GB',
    weight: {
      value: 693,
    },
    tags: [
      'Samsung',
      'Windows (desktop-class)',
      'Microsoft Windows 10 Pro',
      '2016 Apr',
      'Tablet',
    ],
    user: 'mc',
  },
  {
    name: 'SM-T377W Galaxy Tab E 8.0 4G LTE',
    weight: {
      value: 360,
    },
    tags: [
      'Samsung',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Jun 6',
      'Tablet',
    ],
    user: 'mc',
  },
  {
    name: 'm3 M688Q Dual SIM TD-LTE 16GB',
    weight: {
      value: 132,
    },
    tags: ['Meizu', 'Android', 'Alibaba YunOS 3.1.6', '2016 May', 'Smartphone'],
    user: 'mc',
  },
  {
    name: 'K332 K Series K7 Dual SIM TD-LTE',
    weight: {
      value: 141,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr 18',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P9 Standard Edition Dual SIM TD-LTE EVA-TL00',
    weight: {
      value: 144,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'ZenFone Max Dual SIM Global LTE ZC550KL 16GB',
    weight: {
      value: 202,
    },
    tags: [
      'Asus',
      'Android',
      'Google Android 5.0.2 (Lollipop)',
      '2016 Jan 14',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P9 Lite Dual SIM LTE VNS-L23',
    weight: {
      value: 143,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Quattro L52 VR TD-LTE Dual SIM',
    weight: {
      value: 143,
    },
    tags: [
      'Karbonn',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'ivvi i3 i3-01 Dual SIM LTE 64GB',
    weight: {
      value: 140,
    },
    tags: [
      'Coolpad',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 29',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'P4351',
    weight: {
      value: 168,
    },
    tags: [
      'HTC',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 6 Professional (Crossbow)',
      '2007 Jun',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'GN3001 Elife S5 TD-LTE',
    weight: {
      value: 163,
    },
    tags: [
      'GiONEE',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 May 16',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Y5II CUN-L23 Dual SIM LTE LATAM',
    weight: {
      value: 135,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'GR5 LTE KII-L05',
    weight: {
      value: 158,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'K540 K Series Stylo 2 4G LTE',
    weight: {
      value: 145,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 21',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G5 H830 LTE-A US',
    weight: {
      value: 155,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Mar 19',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'AS330 K Series K7 LTE',
    weight: {
      value: 159,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Z818L Allstar Stratos LTE / Z818G',
    weight: {
      value: 172,
    },
    tags: [
      'ZTE',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2015 Nov 3',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'RS987 V10 LRA LTE-A',
    weight: {
      value: 192,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1.1 (Lollipop)',
      '2016 Jan',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'SM-G389F Galaxy Xcover 3 Value Edition',
    weight: {
      value: 154,
    },
    tags: [
      'Samsung',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr 16',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'A9100',
    weight: {
      value: 168,
    },
    tags: [
      'Qtek',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 5.0 for Pocket PC Phone Edition (Magneto)',
      '2006 Mar',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G5 RS988 LTE-A',
    weight: {
      value: 159,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Y3II 4G LTE LUA-L01 / Y3 II Eco',
    weight: {
      value: 150,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'F720K Stylus 2 4G LTE',
    weight: {
      value: 145,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 Mar 11',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G9 Dual SIM TD-LTE VNS-DL00 / G9 Youth Edition',
    weight: {
      value: 143,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'A37 Dual SIM TD-LTE CN A37m',
    weight: {
      value: 143,
    },
    tags: [
      'Oppo',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2016 May 17',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'HS-F30 TD-LTE',
    weight: {
      value: 140,
    },
    tags: [
      'Hisense',
      'Android',
      'Google Android 6.0 (Marshmallow)',
      '2016 May',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Z2 Pro Ultimate Edition TD-LTE Dual SIM 128GB',
    weight: {
      value: 145,
    },
    tags: [
      'ZUK',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May 29',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'GN9011L Elife S8 Dual SIM TD-LTE 64GB',
    weight: {
      value: 147,
    },
    tags: [
      'GiONEE',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'S411',
    weight: {
      value: 105,
    },
    tags: [
      'HTC',
      'Windows (mobile-class)',
      'Microsoft Windows Mobile 5.0 for Smartphone',
      '2006 Aug',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'Honor V8 Premium Edition Dual SIM TD-LTE 64GB KNT-AL20',
    weight: {
      value: 170,
    },
    tags: [
      'Huawei',
      'Android',
      'Google Android 6.0.1 (Marshmallow)',
      '2016 May 17',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'AS995 G Flex2 ACG LTE-A',
    weight: {
      value: 152,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.0.2 (Lollipop)',
      '2015 Apr',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'MS631 G Stylo LTE',
    weight: {
      value: 163,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.1 (Lollipop)',
      '2015 Jun',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'G3 AS990 ACG LTE-A',
    weight: {
      value: 149,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 4.4.2 (KitKat)',
      '2014 Sep',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'L21G Destiny HSPA',
    weight: {
      value: 139,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.0.1 (Lollipop)',
      '2015 Sep',
      'Smartphone',
    ],
    user: 'mc',
  },
  {
    name: 'L22C Power CDMA',
    weight: {
      value: 139,
    },
    tags: [
      'LG',
      'Android',
      'Google Android 5.0.1 (Lollipop)',
      '2015 Sep',
      'Smartphone',
    ],
    user: 'mc',
  },
];
