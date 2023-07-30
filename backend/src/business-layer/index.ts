
import { KafkaModule } from './kafka/kafka.module';
import { SenderModule } from './sender/sender.module';

export const BUSINESS_LAYER_MODULES: any[] = [
  SenderModule,
  KafkaModule
];
