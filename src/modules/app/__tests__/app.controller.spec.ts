import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';

class MockAppService {
  getHello() {
    return 'Hello World!';
  }
}

describe('AppController', () => {
  let controller: AppController;

  let mockAppService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useClass: MockAppService }],
    }).compile();

    controller = module.get(AppController);
    mockAppService = module.get(AppService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get hello', () => {
      it('should get hello', async () => {
        jest.spyOn(mockAppService, 'getHello');

        expect(controller.getHello()).toEqual('Hello World!');
        expect(mockAppService.getHello).toHaveBeenCalled();
      });
    });
  });
});
