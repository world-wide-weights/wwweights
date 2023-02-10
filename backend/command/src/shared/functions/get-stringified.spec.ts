import { getStringified } from './get-stringified';

describe('getStringified', () => {
  it('should return stringified object with multiple lines', () => {
    const obj = {
      query: 'query',
      tags: ['tag1', 'tag2'],
    };
    expect(getStringified(obj)).toEqual(
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
