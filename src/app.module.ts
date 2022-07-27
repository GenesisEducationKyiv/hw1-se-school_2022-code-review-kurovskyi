import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RateModule } from './modules/rate/rate.module';

@Module({
  imports: [RateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
