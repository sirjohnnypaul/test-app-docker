import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AppGateway } from '../../app.gateway';
import { UniversalMailerService } from '../mailer/services/universal-mailer.service';

@Injectable()
export class KafkaService {
  private readonly kafka: Kafka;
  private producer: any;
  private consumer: any;
  private batchSize: number = 1000;

  constructor(
    private readonly gateway: AppGateway,
    private readonly _universalMailerService: UniversalMailerService,
  ) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [process.env.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'email-progress-group' });
  }

  async sendEmailRequest(emailsCount: number): Promise<void> {
    await this.producer.connect();

    let progress = 0;

    for (let i = 0; i < emailsCount; i += this.batchSize) {
      const messages = Array.from(
        { length: Math.min(this.batchSize, emailsCount - i) },
        (_, j) => {
          progress++;
          return {
            value: JSON.stringify({
              requestNumber: i + j + 1,
              progress: progress,
              total: emailsCount,
            }),
          };
        },
      );

      const emailPayload = {
        topic: 'email_progress',
        messages,
      };

      await this.producer.send(emailPayload);
    }

    await this.producer.disconnect();
  }

  async emailProgressListener(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: 'email_progress',
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const { progress, total } = JSON.parse(message.value.toString());
            if (progress % this.batchSize === 0 || progress === total) {
              await this._universalMailerService.sendMail(
                'views/emails/test-email.hbs',
                {
                  header: 'Test Header',
                  message: 'Test message',
                },
                `Test email`,
                process.env.MAILER_TEST_RECIPIENT,
                false,
              );
              console.log('Email progress:', progress, total);
              await this.gateway.server.emit('progress', { progress, total });
            }
          } catch (err) {
            console.error('Error processing message:', err);
          }
        },
      });
    } catch (err) {
      console.error('Error connecting to Kafka:', err);
    }
  }
}
