import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { RateType } from './rate.type';
import { RateBadRequestException } from './exceptions';
import { AppConfigService } from '../shared/services';

@Injectable()
export class RateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  async get(): Promise<RateType> {
    try {
      const rateResponse = await this.httpService.axiosRef.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': this.configService.external.rateApiKey,
          },
          params: { convert: 'UAH' },
        },
      );

      const rate = rateResponse.data.data[0].quote.UAH.price;

      return rate;
    } catch {
      throw new RateBadRequestException();
    }
  }
}
