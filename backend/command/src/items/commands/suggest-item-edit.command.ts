import { SuggestItemEditDTO } from '../interfaces/suggest-item-edit.dto';

export class SuggestItemEditCommand {
  constructor(
    public readonly suggestItemEditDto: SuggestItemEditDTO,
    public readonly itemSlug: string,
    public readonly userId: number,
  ) {}
}
