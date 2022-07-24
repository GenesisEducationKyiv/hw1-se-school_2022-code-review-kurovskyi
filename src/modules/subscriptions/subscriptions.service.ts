import { Injectable } from '@nestjs/common';

import { SubscribeDto } from './dtos';
import { SubscriptionConflictException } from './exceptions';

@Injectable()
export class SubscriptionsService {
  async subscribe(subscribeDto: SubscribeDto): Promise<any> {
    // TODO: Adding email logic;

    const emailAlreadyExists = false;

    if (emailAlreadyExists) {
      throw new SubscriptionConflictException();
    }

    return subscribeDto.email;
  }

  async sendEmails(): Promise<void> {
    // TODO: Sending emails logic;

    return;
  }
}
