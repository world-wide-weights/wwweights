import { ItemEditedEventDTO } from '../../eventstore/dtos/edited-item-event.dto';

/**
 * @description Event for editing an item i.e. changing its values
 */
export class ItemEditedEvent {
  constructor(public readonly itemEditedEventDto: ItemEditedEventDTO) {}
}
