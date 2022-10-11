import { Test, TestingModule } from '@nestjs/testing';

import { SubscriptionsController } from '../subscriptions.controller';
import { SubscriptionsService } from '../subscriptions.service';

class MockSubscriptionsService {
  async getAllSubscribers(): Promise<string[]> {
    return [];
  }

  async subscribe(): Promise<void> {
    return;
  }

  async sendEmails(): Promise<void> {
    return;
  }
}

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;

  let mockSubscriptionsService: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useClass: MockSubscriptionsService,
        },
      ],
    }).compile();

    controller = module.get(SubscriptionsController);
    mockSubscriptionsService = module.get(SubscriptionsService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('subscribe', () => {
      it('should subscribe user', async () => {
        jest.spyOn(mockSubscriptionsService, 'subscribe');

        await expect(
          controller.subscribe({ email: 'me@kurovskyi.dev' }),
        ).resolves.toBe(undefined);
        expect(mockSubscriptionsService.subscribe).toHaveBeenCalled();
      });
    });

    describe('send emails', () => {
      it('should send emails to all subscribers', async () => {
        jest.spyOn(mockSubscriptionsService, 'sendEmails');

        await expect(controller.sendEmails()).resolves.toBe(undefined);
        expect(mockSubscriptionsService.sendEmails).toHaveBeenCalled();
      });
    });
  });
});
