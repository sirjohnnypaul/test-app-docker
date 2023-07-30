import { Injectable } from '@nestjs/common';
import { SenderModel } from '../models/sender.model';
import { KafkaService } from '../../kafka/kafka.service';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class SenderService {
  constructor(
    private readonly _kafkaService: KafkaService,
  ) {}

  async sendBulkEmails(
    emails:number
  ): Promise<SenderModel.SenderResponseDTO> {
    //pass all to queue kafka
    const jobId = uuidv4();
    const response = new SenderModel.SenderResponseDTO();
  
    response.message = "Emails queue started successfully. You can monitor the progress";
    response.jobId = jobId.toString();
  
    // Move Kafka process to next tick of the event loop, allowing function to return response immediately
    process.nextTick(() => {
      this._kafkaService.sendEmailRequest(emails).catch(err => {
        console.error(err);
        // You may want to add additional error handling logic here
      });
    });
  
    return response;
    
  }


}
