import type { Cache } from 'cache-manager';

import { IRateApiProvider } from '../interfaces';

const rateApiProviderResultCacheKey = 'rateApiProviderResult';

export class RateApiProviderCacheProxy implements IRateApiProvider {
  constructor(
    private readonly rateApiProvider: IRateApiProvider,
    private readonly cacheManager: Cache,
  ) {}

  async getRate() {
    const cachedRate = await this.cacheManager.get<number | null>(
      rateApiProviderResultCacheKey,
    );

    if (cachedRate) {
      return cachedRate;
    }

    const apiRate = await this.rateApiProvider.getRate();

    await this.cacheManager.set<number>(
      rateApiProviderResultCacheKey,
      apiRate,
      {
        ttl: 300,
      },
    );

    return apiRate;
  }
}
