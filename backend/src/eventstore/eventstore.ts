import { Injectable, Logger } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { BehaviorSubject } from 'rxjs';
import { ItemCreatedEvent } from '../commands.module/events/item-created.event';

export const logStringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};
@Injectable()
export class EventStore {
  private readonly logger = new Logger(EventStore.name);
  private latestId = 0;
  private eventsStream = new BehaviorSubject<{
    id: number;
    type: string;
    event: any;
  }>(null);

  private readonly eventMap = new Map([['ItemCreatedEvent', ItemCreatedEvent]]);

  private kafkaConnection: Kafka;

  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;

  constructor() {
    this.kafkaConnection = new Kafka({
      clientId: 'wwweights-backend',
      brokers: ['localhost:3007'],
    });
    this.kafkaConsumer = this.kafkaConnection.consumer({ groupId: 'backend' });
    this.kafkaProducer = this.kafkaConnection.producer();
    this.kafkaProducer.connect();

    this.kafkaConsumer.subscribe({ topics: ['*'] });
    this.kafkaConsumer.run({
      eachMessage: async (payload) => console.log(payload),
    });
  }

  public addEvent(type: string, event: any) {
    this.kafkaProducer.send({
      topic: type,
      messages: [
        {
          key: 'event',
          value: event,
        },
      ],
    });
    this.logger.log('Added event');
  }

}
