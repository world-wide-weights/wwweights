import { getStringified } from './get-stringified';

describe('getStringified', () => {
  it('should return stringified object with multiple lines', () => {
    const obj = {
      query: 'query',
      tags: ['tag1', 'tag2'],
    };
    expect(getStringified(obj)).toEqual(
      // Since we expect something formatted, we have to force it here
      // eslint-disable-next-line prettier/prettier
`{
  "query": "query",
  "tags": [
    "tag1",
    "tag2"
  ]
}`,
    );
  });
});
