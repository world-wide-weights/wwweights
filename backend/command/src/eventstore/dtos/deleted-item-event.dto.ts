/**
 * @description DTO for sending an item deleted event to eventstore
 */
export class ItemDeletedEventDTO {
  itemSlug: string;
  suggestionUuid: string;
  userId: number;
}
