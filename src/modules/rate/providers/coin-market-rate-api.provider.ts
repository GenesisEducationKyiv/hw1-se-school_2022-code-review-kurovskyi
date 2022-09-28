import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../../shared';
import { IRateApiProvider } from '../interfaces';

export class CoinMarketRateApiProvider implements IRateApiProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  async getRate() {
    const rateResponse = await this.httpService.axiosRef.get(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': this.configService.external.coinMarketApiKey,
        },
        params: { convert: 'UAH' },
      },
    );

    const rate = rateResponse.data.data[0].quote.UAH.price;

    return rate;
  }
}
