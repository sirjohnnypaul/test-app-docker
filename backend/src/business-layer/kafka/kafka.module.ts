import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AppGateway } from '../../app.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // This will load environment variables
  ],
  providers: [KafkaService, AppGateway],
  exports: [KafkaService],
})
export class KafkaModule {}
