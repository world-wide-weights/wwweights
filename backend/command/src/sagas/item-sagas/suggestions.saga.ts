import { Injectable, Logger } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { EventStore } from '../../eventstore/eventstore';
import { DeleteItemCommand } from '../../commands/item-commands/delete-item.command';
import { ItemDeleteSuggestedEvent } from '../../events/item-events/item-delete-suggested.event';
import { ItemEditSuggestedEvent } from '../../events/item-events/item-edit-suggested.event';
import { EditItemCommand } from '../../commands/item-commands/edit-item.command';

@Injectable()
export class SuggestionsSaga {
  private readonly logger = new Logger(SuggestionsSaga.name);
  constructor(private readonly eventstore: EventStore) {}

    /**
   * @description Saga responsible for spawning itemedeleted events based on suggestions once the requirement is met
   */
  @Saga()
  deleteSuggestionSaga = (
    events$: Observable<any>,
  ): Observable<ICommand | void> => {
    return events$.pipe(
      ofType(ItemDeleteSuggestedEvent),
      map((event) => {
        // Hint: This spawns the delete command as an immediate reaction to the suggestion event
        // This is not final behaviour but rather temporary until Frontend supports suggestion votes
        // The final product would react to an suggestion approve event
        if (!this.eventstore.isReady) {
          this.logger.debug(
            `${ItemDeleteSuggestedEvent.name} ignored as eventstore is in replay`,
          );
          return;
        }
        const res = new DeleteItemCommand(
          event.deleteSuggestion.itemSlug,
          event.deleteSuggestion.uuid,
        );
        this.logger.debug(
          `${SuggestionsSaga.name} published ${DeleteItemCommand.name} to commandBus`,
        );
        return res;
      }),
    );
  };

  /**
   * @description Saga responsible for spawning itemedited events based on suggestions once the requirement is met
   */
  @Saga()
  editSuggestionSaga = (
    events$: Observable<any>,
  ): Observable<ICommand | void> => {
    return events$.pipe(
      ofType(ItemEditSuggestedEvent),
      map((event) => {
        // Hint: This spawns the delete command as an immediate reaction to the suggestion event
        // This is not final behaviour but rather temporary until Frontend supports suggestion votes
        // The final product would react to an suggestion approve event
        if (!this.eventstore.isReady) {
          this.logger.debug(
            `${ItemEditSuggestedEvent.name} ignored as eventstore is in replay`,
          );
          return;
        }
        const res = new EditItemCommand(
          event.editSuggestion.itemSlug,
          event.editSuggestion.uuid,
          event.editSuggestion.updatedItemValues,
        );
        this.logger.debug(
          `${SuggestionsSaga.name} published ${EditItemCommand.name} to commandBus`,
        );
        return res;
      }),
    );
  };
}
