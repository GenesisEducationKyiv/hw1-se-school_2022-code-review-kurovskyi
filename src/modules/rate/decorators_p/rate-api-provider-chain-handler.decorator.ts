import type { IRateApiProvider } from '../interfaces';

export class RateApiProviderChainHandlerDecorator implements IRateApiProvider {
  private nextHandler: RateApiProviderChainHandlerDecorator;

  constructor(private readonly rateApiProvider: IRateApiProvider) {}

  setNext(
    handler: RateApiProviderChainHandlerDecorator,
  ): RateApiProviderChainHandlerDecorator {
    this.nextHandler = handler;
    return handler;
  }

  async getRate() {
    try {
      const rate = await this.rateApiProvider.getRate();

      return rate;
    } catch (error) {
      if (this.nextHandler) {
        return this.nextHandler.getRate();
      }

      throw error;
    }
  }
}
