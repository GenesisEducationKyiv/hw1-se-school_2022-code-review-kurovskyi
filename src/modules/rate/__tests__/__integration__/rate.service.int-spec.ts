import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { RateService } from '../../rate.service';
import { AppModule } from '../../../app';

describe('RateService', () => {
  let service: RateService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get(RateService);
    httpService = module.get(HttpService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get rate', () => {
      it('should get rate', async () => {
        jest.spyOn(httpService.axiosRef, 'get');

        await expect(service.getRate()).resolves.toEqual(expect.any(Number));
        expect(httpService.axiosRef.get).toHaveBeenCalled();
      });
    });
  });
});
