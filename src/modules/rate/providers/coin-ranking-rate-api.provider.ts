import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../../shared';
import { IRateApiProvider } from '../interfaces';

export class CoinRankingRateApiProvider implements IRateApiProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  async getRate() {
    const rateResponse = await this.httpService.axiosRef.get(
      'https://api.coinranking.com/v2/coin/Qwsogvtv82FCd/price',
      {
        headers: {
          'X-Access-Token': this.configService.external.coinRankingApiKey,
        },
        params: { referenceCurrencyUuid: 'aO2oUx6Gp-f' },
      },
    );

    const rate = rateResponse.data.data.price;

    return rate;
  }
}
