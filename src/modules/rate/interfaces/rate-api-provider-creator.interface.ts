import { IRateApiProvider } from './rate-api-provider.interface';

export interface IRateApiProviderCreator {
  createApiProvider: () => IRateApiProvider;
}
