import {
  Body,
  Controller, Get, Post,
} from '@nestjs/common';
import { SenderService } from '../services/sender.service';
import { SenderModel } from '../models/sender.model';

@Controller('sender')
export class SenderController {
  constructor(private readonly _senderService: SenderService) {}

  @Post('send_emails')
  sendBulkEmails(
    @Body() data: SenderModel.SenderDTO,
  ): Promise<SenderModel.SenderResponseDTO> {
    console.log("PROCESSING", data.emails)
    return this._senderService.sendBulkEmails(data.emails);
  }

  @Get('status')
  checkStatus(
  ): boolean {
    return true
  }
}
