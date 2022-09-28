import { Injectable, Inject } from '@nestjs/common';

import type { Rate } from './types';
import {
  type IRateApiProvider,
  RATE_API_PROVIDER_INTERFACE_KEY,
} from './interfaces';
import { RateBadRequestException } from './exceptions';

@Injectable()
export class RateService {
  constructor(
    @Inject(RATE_API_PROVIDER_INTERFACE_KEY)
    private readonly rateApiProvider: IRateApiProvider,
  ) {}

  async getRate(): Promise<Rate> {
    try {
      const rate = await this.rateApiProvider.getRate();

      return rate;
    } catch (error) {
      throw new RateBadRequestException(error);
    }
  }
}
