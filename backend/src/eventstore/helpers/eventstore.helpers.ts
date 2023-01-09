export function generateStreamId(type: string, identifier: string): string {
  return `${type}-${identifier}`;
}

export function extractTypeFromStreamId(streamId: string): string {
  return streamId.split('-')[0];
}
