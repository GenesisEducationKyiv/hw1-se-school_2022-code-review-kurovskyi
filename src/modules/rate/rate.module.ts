import { Module } from '@nestjs/common';

import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
