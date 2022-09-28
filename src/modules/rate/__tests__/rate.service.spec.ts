import { Test, TestingModule } from '@nestjs/testing';

import { RateBadRequestException } from '../exceptions';
import {
  type IRateApiProvider,
  RATE_API_PROVIDER_INTERFACE_KEY,
} from '../interfaces';
import { RateService } from '../rate.service';

const mockRate = 777;

class MockRateApiProvider implements IRateApiProvider {
  getRate = jest.fn().mockResolvedValue(mockRate);
}

describe('RateService', () => {
  let service: RateService;

  let mockRateApiProvider: IRateApiProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        {
          provide: RATE_API_PROVIDER_INTERFACE_KEY,
          useClass: MockRateApiProvider,
        },
      ],
    }).compile();

    service = module.get(RateService);
    mockRateApiProvider = module.get(RATE_API_PROVIDER_INTERFACE_KEY);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get rate', () => {
      it('should get rate with working api', async () => {
        await expect(service.getRate()).resolves.toEqual(mockRate);
        expect(mockRateApiProvider.getRate).toHaveBeenCalled();
      });

      it('should throws an error if api fails', async () => {
        jest.spyOn(mockRateApiProvider, 'getRate').mockImplementation(() => {
          throw new Error();
        });

        await expect(service.getRate()).rejects.toEqual(
          new RateBadRequestException(),
        );
        expect(mockRateApiProvider.getRate).toHaveBeenCalled();
      });
    });
  });
});
