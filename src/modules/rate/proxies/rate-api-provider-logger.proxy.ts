import { Logger } from '@nestjs/common';

import { IRateApiProvider } from '../interfaces';

export class RateApiProviderLoggerProxy implements IRateApiProvider {
  constructor(private readonly rateApiProvider: IRateApiProvider) {}

  async getRate() {
    const rate = await this.rateApiProvider.getRate();

    Logger.log(`${this.rateApiProvider.constructor.name}: Response - ${rate}`);

    return rate;
  }
}
