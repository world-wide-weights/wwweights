export class EditItemCommand {
  constructor(
    public readonly itemSlug: string,
    public readonly suggestionUuid: string,
  ) {}
}
