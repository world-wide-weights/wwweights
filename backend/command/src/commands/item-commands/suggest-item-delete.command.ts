import { SuggestItemDeleteDTO } from '../../controllers/dtos/suggest-item-delete.dto';

/**
 * @description Command to initiate item delete suggestion flow
 */
export class SuggestItemDeleteCommand {
  constructor(
    public readonly suggestItemDeleteDto: SuggestItemDeleteDTO,
    public readonly itemSlug: string,
    public readonly userId: number,
  ) {}
}
