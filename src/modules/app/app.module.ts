import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfigService, SharedModule } from '../shared';
import { RateModule } from '../rate';
import { SubscriptionsModule } from '../subscriptions';
import { MailModule } from '../mail';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${
        process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV
      }.env`,
      expandVariables: true,
    }),
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => {
        return appConfig.throttler;
      },
    }),
    CacheModule.register({ isGlobal: true, ttl: 60, max: 10 }),
    SharedModule,
    RateModule,
    SubscriptionsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
