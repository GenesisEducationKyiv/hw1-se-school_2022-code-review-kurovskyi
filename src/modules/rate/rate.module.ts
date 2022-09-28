import { CACHE_MANAGER, Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import type { Cache } from 'cache-manager';

import { AppConfigService } from '../shared';
import {
  RATE_API_PROVIDER_INTERFACE_KEY,
  type IRateApiProvider,
} from './interfaces';
import {
  CoinMarketRateApiProviderCreator,
  CoinRankingRateApiProviderCreator,
} from './factories';
import { RateApiProviderChainHandlerDecorator } from './decorators_p';
import {
  RateApiProviderCacheProxy,
  RateApiProviderLoggerProxy,
} from './proxies';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [HttpModule],
  providers: [
    RateService,
    {
      provide: RATE_API_PROVIDER_INTERFACE_KEY,
      useFactory: (
        httpService: HttpService,
        configService: AppConfigService,
        cacheManager: Cache,
      ): IRateApiProvider => {
        const MainRateApiProviderCreator =
          configService.external.rateApiProvider === 'CoinMarket'
            ? CoinMarketRateApiProviderCreator
            : CoinRankingRateApiProviderCreator;

        const mainRateApiProviderChainHandler =
          new RateApiProviderChainHandlerDecorator(
            new RateApiProviderCacheProxy(
              new RateApiProviderLoggerProxy(
                new MainRateApiProviderCreator(
                  httpService,
                  configService,
                ).createApiProvider(),
              ),
              cacheManager,
            ),
          );

        [CoinRankingRateApiProviderCreator, CoinMarketRateApiProviderCreator]
          .filter(
            (ProviderCreator) => ProviderCreator !== MainRateApiProviderCreator,
          )
          .forEach((ProviderCreator) => {
            mainRateApiProviderChainHandler.setNext(
              new RateApiProviderChainHandlerDecorator(
                new RateApiProviderCacheProxy(
                  new RateApiProviderLoggerProxy(
                    new ProviderCreator(
                      httpService,
                      configService,
                    ).createApiProvider(),
                  ),
                  cacheManager,
                ),
              ),
            );
          });

        return mainRateApiProviderChainHandler;
      },
      inject: [HttpService, AppConfigService, CACHE_MANAGER],
    },
  ],
  controllers: [RateController],
  exports: [RateService],
})
export class RateModule {}
