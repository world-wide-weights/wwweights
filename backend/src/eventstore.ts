import { Logger } from '@nestjs/common';

export class EventStore {
  private readonly logger = new Logger(EventStore.name);
}
