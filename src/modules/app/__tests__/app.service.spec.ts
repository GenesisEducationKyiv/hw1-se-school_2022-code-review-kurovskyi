import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get(AppService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get hello', () => {
      it('should get hello', async () => {
        expect(service.getHello()).toEqual('Hello World!');
      });
    });
  });
});
