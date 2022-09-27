import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { type INestApplication, HttpStatus } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { AppService } from '../../app.service';

class MockAppService {
  getHello() {
    return 'Hello World!';
  }
}

describe('AppModule', () => {
  let app: INestApplication;

  let mockAppService: AppService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [{ provide: AppService, useClass: MockAppService }],
    }).compile();

    app = module.createNestApplication();
    mockAppService = module.get(AppService);
    await app.init();
  });

  describe('GET', () => {
    it(`OK`, () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(HttpStatus.OK)
        .expect(mockAppService.getHello());
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
