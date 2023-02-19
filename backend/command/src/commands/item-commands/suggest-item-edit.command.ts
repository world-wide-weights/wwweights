import { SuggestItemEditDTO } from '../../controllers/dtos/suggest-item-edit.dto';

/**
 * @description Command initiating item edit suggestion flow
 */
export class SuggestItemEditCommand {
  constructor(
    public readonly suggestItemEditDto: SuggestItemEditDTO,
    public readonly itemSlug: string,
    public readonly userId: number,
  ) {}
}
