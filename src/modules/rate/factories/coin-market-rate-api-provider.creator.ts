import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../../shared';
import type { IRateApiProvider, IRateApiProviderCreator } from '../interfaces';
import { CoinMarketRateApiProvider } from '../providers';

export class CoinMarketRateApiProviderCreator
  implements IRateApiProviderCreator
{
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  createApiProvider(): IRateApiProvider {
    return new CoinMarketRateApiProvider(this.httpService, this.configService);
  }
}
