import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AppGateway } from '../../app.gateway';

@Injectable()
export class KafkaService {
  private readonly kafka: Kafka;
  private producer: any;
  private consumer: any;

  constructor(private readonly gateway: AppGateway) {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: [`localhost:9092`]
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'email-progress-group' });
  }

  async sendEmailRequest(emailsCount: number): Promise<void> {
    await this.producer.connect()

    const batchSize = 1000;
    let progress = 0;

    for (let i = 0; i < emailsCount; i += batchSize) {
        const messages = Array.from({ length: Math.min(batchSize, emailsCount - i) }, (_, j) => {
            progress++;
            return {
                value: JSON.stringify({ 
                requestNumber: i + j + 1,
                progress: progress,
                total: emailsCount
                }),
            }
            })

        const emailPayload = {
            topic: 'email_progress',
            messages,
        }

        await this.producer.send(emailPayload)
        console.log("BATCH SENT", i)
    }

    await this.producer.disconnect()
  }

  async emailProgressListener(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: 'email_progress', fromBeginning: true });
  
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const { progress, total } = JSON.parse(message.value.toString());
            console.log('Email progress:', progress, total);
            // Emit an event to the frontend with the progress update
            await this.gateway.server.emit('progress', { progress, total });
            if(progress === total) {
                console.log("EMMITING LAST ONE", progress, total)
              // Emit an event to the frontend to indicate that the emails are done sending
              await this.gateway.server.emit('progress', { progress, total });
            }
          } catch(err) {
            console.error('Error processing message:', err);
          }
        },
      });
    } catch(err) {
      console.error('Error connecting to Kafka:', err);
    }
  }
  
}
