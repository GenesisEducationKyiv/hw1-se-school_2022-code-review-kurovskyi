import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { Rate } from '../rate/types';

import { SendMailInput } from './interfaces';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendNewRate(sendMailInput: SendMailInput<{ rate: Rate }>) {
    const title = 'New BTC Rate';
    const bodyText = `Here is the new BTC rate: ${sendMailInput.data.rate} UAH for 1 BTC`;
    const devLink = 'https://kurovskyi.dev';
    const devLinkText = 'kurovskyi.dev';

    if (Array.isArray(sendMailInput.to) && !sendMailInput.to.length) {
      return;
    }

    await this.mailerService.sendMail({
      to: sendMailInput.to,
      subject: title,
      text: bodyText,
      template: 'rate',
      context: {
        title,
        bodyText,
        devLink,
        devLinkText,
      },
    });
  }
}
