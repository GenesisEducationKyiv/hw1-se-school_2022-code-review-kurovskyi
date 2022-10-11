import { Module } from '@nestjs/common';

import { MailModule } from '../mail';
import { RateModule } from '../rate';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribersFileRepository } from './repositories';
import { SUBSCRIBERS_REPOSITORY_INTERFACE_KEY } from './interfaces';

@Module({
  imports: [RateModule, MailModule],
  providers: [
    SubscriptionsService,
    {
      provide: SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
      useClass: SubscribersFileRepository,
    },
  ],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
