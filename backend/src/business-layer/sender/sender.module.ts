import { Module } from '@nestjs/common';
import { SenderController } from './controllers/sender.controller';
import { SenderService } from './services/sender.service';
import { EmailEntityModule } from '../../data-access-layer/email-entity/email-entity.module';
import { KafkaModule } from '../kafka/kafka.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [EmailEntityModule, KafkaModule, MailerModule],
  controllers: [SenderController],
  providers: [SenderService],
})
export class SenderModule {}
