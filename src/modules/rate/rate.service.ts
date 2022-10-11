import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../shared';

import { Rate } from './types';
import { RateBadRequestException } from './exceptions';

@Injectable()
export class RateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  async getRate(): Promise<Rate> {
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
