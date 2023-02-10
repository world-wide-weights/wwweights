import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { EditSuggestion } from 'src/models/edit-suggestion.model';
import { ItemEditSuggestedEvent } from '../events/item-edit-suggested.event';

@Injectable()
export class ItemEditSuggestedSagas {
  private readonly logger = new Logger(ItemEditSuggestedSagas.name);
  constructor(private readonly configService: ConfigService) {}
  // This would (in a final version) also listen to approve events and not only to create events
  @Saga()
  checkSuggestionValid = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(ItemEditSuggestedEvent),
      map((event: ItemEditSuggestedEvent) => {
        this.handleApprovedSuggestion(event.editSuggestion)
      }),
    );
  };


  private handleApprovedSuggestion(suggestion: EditSuggestion){
    if (
        suggestion.approvalCount >=
          this.configService.get<number>('EDIT_SUGGESTION_NEEDED_APPROVLS') ||
        0
      ) {
        // Create the edit item command
        this.logger.debug(
          `Edit suggestion for item ${suggestion.itemSlug} was approved often enough. It will now take effect.`,
        );
      }
  }
}
