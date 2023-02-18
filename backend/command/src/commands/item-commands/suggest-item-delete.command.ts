import { SuggestItemDeleteDTO } from "../../controllers/interfaces/suggest-item-delete.dto";

export class SuggestItemDeleteCommand {
  constructor(
    public readonly suggestItemDeleteDto: SuggestItemDeleteDTO,
    public readonly itemSlug: string,
    public readonly userId: number,
  ) {}
}
