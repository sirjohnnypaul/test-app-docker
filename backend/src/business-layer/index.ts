import { KafkaModule } from './kafka/kafka.module';
import { MailerModule } from './mailer/mailer.module';
import { SenderModule } from './sender/sender.module';

export const BUSINESS_LAYER_MODULES: any[] = [
  SenderModule,
  KafkaModule,
  MailerModule,
];
