import { Module } from '@nestjs/common';

import { MailModule } from '../mail';
import { RateModule } from '../rate';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [RateModule, MailModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
