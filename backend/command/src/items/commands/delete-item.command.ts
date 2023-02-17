export class DeleteItemCommand {
  constructor(
    public readonly itemSlug: string,
    public readonly suggestionUuid: string,
  ) {}
}
