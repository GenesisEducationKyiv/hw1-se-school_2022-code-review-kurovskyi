import { Inject, Injectable } from '@nestjs/common';

import { Email } from '../../common/types';
import { RateService } from '../rate';
import { MailService } from '../mail';

import { SubscribeDto } from './dtos';
import { SubscriptionConflictException } from './exceptions';
import {
  ISubscribersRepository,
  SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
} from './interfaces';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly rateService: RateService,
    private readonly mailService: MailService,
    @Inject(SUBSCRIBERS_REPOSITORY_INTERFACE_KEY)
    private readonly subscribersRepository: ISubscribersRepository,
  ) {}

  async getAllSubscribers(): Promise<Email[]> {
    const allSubscribers = await this.subscribersRepository.getAll();

    return allSubscribers;
  }

  async subscribe({ email }: SubscribeDto): Promise<void> {
    const allSubscribers = await this.getAllSubscribers();

    const emailAlreadyExists = allSubscribers.includes(email);

    if (emailAlreadyExists) {
      throw new SubscriptionConflictException();
    }

    this.subscribersRepository.save({ email });
  }

  async sendEmails(): Promise<void> {
    const allSubscribers = await this.getAllSubscribers();

    const rate = await this.rateService.getRate();

    await this.mailService.sendNewRate({ data: { rate }, to: allSubscribers });
  }
}
