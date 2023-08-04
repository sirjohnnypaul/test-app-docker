import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerModel } from '../models/mailer.model';
@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this._initTransporter();
  }

  async sendEmail(
    to: string,
    subject: string,
    content: string,
    attachments?: any,
  ): Promise<void> {
    if (!this.transporter) {
      this._initTransporter();
    }
    let bccFiled = {};
    const mailOptions: MailerModel.EmailOptions = {
      from: process.env.MAILER_OFFICE,
      to,
      subject,
      html: content,
      attachments,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  private _initTransporter(): void {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      secure: true,
      auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS,
      },
    });
    this.transporter.verify((error, success) => {
      if (error) {
        console.warn('Mail transporter is not ready', error);
      } else {
        console.info('Mail Transporter is ready');
      }
    });
  }
}
