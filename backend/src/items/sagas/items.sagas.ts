import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TestItemSagaCommand } from '../commands/test-item-saga.command';
import { ItemCreatedEvent } from '../events/item-created.event';

@Injectable()
export class ItemsTestSaga {
  @Saga()
  itemCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ItemCreatedEvent),
      // TODO: Remove the delay once we have a real saga
      delay(1000),
      map((event) => {
        return new TestItemSagaCommand(event.item);
      }),
    );
  };
}
