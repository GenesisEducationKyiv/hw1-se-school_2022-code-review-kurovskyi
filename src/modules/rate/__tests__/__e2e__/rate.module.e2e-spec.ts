import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { type INestApplication, HttpStatus } from '@nestjs/common';

import { AppModule } from '../../../app';
import { RateService } from '../../rate.service';
import type { Rate } from '../../types';
import { RateBadRequestException } from '../../exceptions';

const mockRate = 777;

class MockRateService {
  async getRate(): Promise<Rate> {
    return mockRate;
  }
}

describe('RateModule', () => {
  let app: INestApplication;

  let mockRateService: RateService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RateService)
      .useClass(MockRateService)
      .compile();

    app = module.createNestApplication();
    mockRateService = module.get(RateService);
    await app.init();
  });

  describe('GET /rate', () => {
    it(`OK`, async () => {
      const rate = await mockRateService.getRate();

      return request(app.getHttpServer())
        .get('/rate')
        .expect(HttpStatus.OK, `${rate}`);
    });

    it(`EXTERNAL RATE API ERROR`, async () => {
      jest
        .spyOn(mockRateService, 'getRate')
        .mockRejectedValue(new RateBadRequestException());

      return request(app.getHttpServer())
        .get('/rate')
        .expect(
          HttpStatus.BAD_REQUEST,
          JSON.stringify(new RateBadRequestException().getResponse()),
        );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
