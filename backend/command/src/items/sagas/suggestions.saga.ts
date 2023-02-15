import { Injectable } from '@nestjs/common';
import { CommandBus, ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { EventStore } from '../../eventstore/eventstore';
import { DeleteItemCommand } from '../commands/delete-item.command';
import { ItemDeleteSuggestedEvent } from '../events/item-delete-suggested.event';

@Injectable()
export class SuggestionsSaga {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventstore: EventStore,
  ) {}

  @Saga()
  deleteSuggestionSaga = (
    events$: Observable<any>,
  ): Observable<ICommand | void> => {
    return events$.pipe(
      ofType(ItemDeleteSuggestedEvent),
      map((event) => {
        if (!this.eventstore.isReady) {
          console.log('Skipped as in replay');
          return;
        }
        const res = new DeleteItemCommand(
          event.deleteSuggestion.itemSlug,
          event.deleteSuggestion.uuid,
        );
        return res;
      }),
    );
  };
}
