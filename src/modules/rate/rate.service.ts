import { Injectable } from '@nestjs/common';

import { RateType } from './rate.type';
import { RateNotFoundException } from './exceptions/rate-bad-request.exception';

@Injectable()
export class RateService {
  async get(): Promise<RateType> {
    const rate = 101;

    if (!rate) {
      throw new RateNotFoundException();
    }

    return rate;
  }
}
