import { Test, TestingModule } from '@nestjs/testing';

import { Email } from '../../../common/types';
import { Rate } from '../../rate/types';
import { RateService } from '../../rate';
import { MailService } from '../../mail';
import { SubscriptionsService } from '../subscriptions.service';
import { SubscriptionConflictException } from '../exceptions';
import { SUBSCRIBERS_REPOSITORY_INTERFACE_KEY } from '../interfaces';
import { SubscribersFileRepository } from '../repositories';

class MockRateService {
  async getRate(): Promise<Rate> {
    return 100;
  }
}

class MockMailService {
  async sendNewRate(): Promise<void> {
    return;
  }
}

class MockSubscribersFileRepository {
  async getAll(): Promise<Email[]> {
    return [];
  }

  async save(): Promise<void> {
    return;
  }
}

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  let mockRateService: RateService;
  let mockMailService: MailService;
  let mockSubscribersFileRepository: SubscribersFileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: RateService, useClass: MockRateService },
        { provide: MailService, useClass: MockMailService },
        {
          provide: SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
          useClass: MockSubscribersFileRepository,
        },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
    mockRateService = module.get(RateService);
    mockMailService = module.get(MailService);
    mockSubscribersFileRepository = module.get(
      SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
    );
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get all subscribers', () => {
      it('should get all subscribers', async () => {
        const mockFileEmails = ['test@example.com', 'test@example.com'];

        jest
          .spyOn(mockSubscribersFileRepository, 'getAll')
          .mockReturnValue(Promise.resolve(mockFileEmails));

        await expect(service.getAllSubscribers()).resolves.toEqual(
          mockFileEmails,
        );
      });
    });

    describe('subscribe', () => {
      it('should subscribe user', async () => {
        jest.spyOn(mockSubscribersFileRepository, 'save');

        await expect(
          service.subscribe({ email: 'test@gmail.com' }),
        ).resolves.toBe(undefined);
        expect(mockSubscribersFileRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({ email: expect.any(String) }),
        );
      });

      it('should throw error if email is already exists', async () => {
        const email = 'me@kurovskyi.dev';

        jest
          .spyOn(service, 'getAllSubscribers')
          .mockReturnValue(Promise.resolve([email]));

        await expect(service.subscribe({ email })).rejects.toThrow(
          SubscriptionConflictException,
        );
      });
    });

    describe('send emails', () => {
      it('should send emails', async () => {
        const mockSubscribers = ['me@kurovskyi.dev'];

        jest.spyOn(mockRateService, 'getRate');
        jest.spyOn(mockMailService, 'sendNewRate');
        jest
          .spyOn(service, 'getAllSubscribers')
          .mockReturnValue(Promise.resolve(mockSubscribers));

        await expect(service.sendEmails()).resolves.toBe(undefined);
        expect(service.getAllSubscribers).toHaveBeenCalled();
        expect(mockRateService.getRate).toHaveBeenCalled();
        expect(mockMailService.sendNewRate).toHaveBeenCalledWith({
          data: expect.objectContaining({
            rate: expect.any(Number),
          }),
          to: expect.arrayContaining(mockSubscribers),
        });
      });
    });
  });
});
