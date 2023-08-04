import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { UniversalMailerService } from './services/universal-mailer.service';

@Module({
  imports: [],
  providers: [MailerService, UniversalMailerService],
  exports: [UniversalMailerService],
})
export class MailerModule {}
