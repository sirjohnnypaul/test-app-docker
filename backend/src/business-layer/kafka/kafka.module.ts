import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AppGateway } from '../../app.gateway';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [KafkaService, AppGateway],
  exports: [KafkaService],
})
export class KafkaModule {}
