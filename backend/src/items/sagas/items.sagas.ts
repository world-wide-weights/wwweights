import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TestItemSagaCommand } from '../commands/impl/test-item-saga.command';
import { ItemCreatedEvent } from '../events/impl/item-created.event';

@Injectable()
export class ItemsSagas {
  @Saga()
  itemCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ItemCreatedEvent),
      delay(1000), // TODO: This is from an example, maybe we need that later
      map((event) => {
        return new TestItemSagaCommand(event.item);
      }),
    );
  };
}
