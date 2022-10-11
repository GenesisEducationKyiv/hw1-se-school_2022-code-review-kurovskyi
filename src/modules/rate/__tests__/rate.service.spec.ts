import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { AppConfigService } from '../../shared';
import { RateService } from '../rate.service';
import { RateBadRequestException } from '../exceptions';

const mockRate = 100;

class MockHttpService {
  axiosRef = {
    get: async () => {
      const result = {
        data: { data: [{ quote: { UAH: { price: mockRate } } }] },
      };

      return result;
    },
  };
}

class MockAppConfig {
  external = {
    rateApiKey: '123',
  };
}

describe('RateService', () => {
  let service: RateService;

  let mockHttpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: AppConfigService, useClass: MockAppConfig },
      ],
    }).compile();

    service = module.get(RateService);
    mockHttpService = module.get(HttpService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get rate', () => {
      const httpServiceExpectation = () => {
        expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: {
              'X-CMC_PRO_API_KEY': expect.any(String),
            },
            params: { convert: 'UAH' },
          }),
        );
      };

      it('should get rate with working api', async () => {
        jest.spyOn(mockHttpService.axiosRef, 'get');

        await expect(service.getRate()).resolves.toEqual(mockRate);
        httpServiceExpectation();
      });

      it('should throws an error if api fails', async () => {
        jest.spyOn(mockHttpService.axiosRef, 'get').mockImplementation(() => {
          throw new RateBadRequestException();
        });

        await expect(service.getRate()).rejects.toEqual(
          new RateBadRequestException(),
        );
        httpServiceExpectation();
      });
    });
  });
});
