import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';

import { Email } from '../../common/types';
import { RateService } from '../rate';
import { MailService } from '../mail';

import { SubscribeDto } from './dtos';
import { SubscriptionConflictException } from './exceptions';

const DATA_DIR = path.join(__dirname, '../../../data');
const FILE_PATH = path.join(DATA_DIR, 'subscribers.txt');

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly rateService: RateService,
    private readonly mailService: MailService,
  ) {}

  async getAllSubscribers(): Promise<Email[]> {
    if (!fs.existsSync(FILE_PATH)) {
      return [];
    }

    const subscribers = fs
      .readFileSync(FILE_PATH, 'utf8')
      .split('\n')
      .filter((str) => str);

    return subscribers;
  }

  async subscribe({ email }: SubscribeDto): Promise<void> {
    const allSubscribers = await this.getAllSubscribers();

    const emailAlreadyExists = allSubscribers.includes(email);

    if (emailAlreadyExists) {
      throw new SubscriptionConflictException();
    }

    if (!fs.existsSync(FILE_PATH)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
      }

      return fs.writeFileSync(FILE_PATH, email, { flag: 'wx' });
    }

    fs.appendFileSync(FILE_PATH, `\n${email}`);
  }

  async sendEmails(): Promise<void> {
    const allSubscribers = await this.getAllSubscribers();

    const rate = await this.rateService.get();

    await this.mailService.sendNewRate({ data: { rate }, to: allSubscribers });
  }
}
