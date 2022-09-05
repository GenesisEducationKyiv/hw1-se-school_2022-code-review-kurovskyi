import { Test, TestingModule } from '@nestjs/testing';

import { Rate } from '../types';
import { RateController } from '../rate.controller';
import { RateService } from '../rate.service';

const mockRate = 100;

class MockRateService {
  async getRate(): Promise<Rate> {
    return mockRate;
  }
}

describe('RateController', () => {
  let controller: RateController;

  let mockRateService: RateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RateController],
      providers: [{ provide: RateService, useClass: MockRateService }],
    }).compile();

    controller = module.get(RateController);
    mockRateService = module.get(RateService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get rate', () => {
      it('should get rate', async () => {
        jest.spyOn(mockRateService, 'getRate');

        await expect(controller.getRate()).resolves.toEqual(mockRate);
        expect(mockRateService.getRate).toHaveBeenCalled();
      });
    });
  });
});
