import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../../shared';
import type { IRateApiProvider, IRateApiProviderCreator } from '../interfaces';
import { CoinRankingRateApiProvider } from '../providers';

export class CoinRankingRateApiProviderCreator
  implements IRateApiProviderCreator
{
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  createApiProvider(): IRateApiProvider {
    return new CoinRankingRateApiProvider(this.httpService, this.configService);
  }
}
