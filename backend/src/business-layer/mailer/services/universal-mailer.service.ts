import { MailerService } from './mailer.service';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UniversalMailerService {
  constructor(private readonly _mailerService: MailerService) {}

  async sendMail(
    htmlTemplate: string,
    parameters: object,
    title: string,
    email: string,
    sleepEnabled: boolean,
  ): Promise<void> {
    const html = fs.readFileSync(htmlTemplate, {
      encoding: 'utf8',
    });
    const tmpl = hbs.compile(html);
    const replacements = {
      ...parameters,
    };
    const readyTemplate: string = tmpl(replacements);

    if (sleepEnabled) {
      sleep(1000);
    }
    return this._mailerService.sendEmail(email, title, readyTemplate);
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
