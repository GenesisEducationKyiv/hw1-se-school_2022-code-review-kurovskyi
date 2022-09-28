import { Rate } from '../types';

export const RATE_API_PROVIDER_INTERFACE_KEY = 'IRateApiProvider';

export interface IRateApiProvider {
  getRate: () => Promise<Rate>;
}
