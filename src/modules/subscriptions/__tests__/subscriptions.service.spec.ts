import * as fs from 'fs';

import { Test, TestingModule } from '@nestjs/testing';

import { Rate } from '../../rate/types';
import { RateService } from '../../rate';
import { MailService } from '../../mail';
import { SubscriptionsService } from '../subscriptions.service';
import { SubscriptionConflictException } from '../exceptions';

jest.mock('fs');

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

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;

  let mockRateService: RateService;
  let mockMailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: RateService, useClass: MockRateService },
        { provide: MailService, useClass: MockMailService },
      ],
    }).compile();

    service = module.get(SubscriptionsService);
    mockRateService = module.get(RateService);
    mockMailService = module.get(MailService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get all subscribers', () => {
      it('should get all subscribers if data file is exists and full', async () => {
        const mockFileEmails = ['test@example.com', 'test@example.com'];

        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest
          .spyOn(fs, 'readFileSync')
          .mockReturnValue(mockFileEmails.join('\n'));

        await expect(service.getAllSubscribers()).resolves.toEqual(
          mockFileEmails,
        );
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalled();
      });

      it('should get all subscribers if data file is exists and empty', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('');

        await expect(service.getAllSubscribers()).resolves.toEqual([]);
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalled();
      });

      it('should get all subscribers if data file is not exists', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);

        await expect(service.getAllSubscribers()).resolves.toEqual([]);
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.readFileSync).not.toHaveBeenCalled();
      });
    });

    describe('subscribe', () => {
      it('should create data file if is not exists and subscribe user', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        jest.spyOn(fs, 'mkdirSync').mockImplementation();
        jest.spyOn(fs, 'writeFileSync').mockImplementation();

        await expect(
          service.subscribe({ email: 'test@gmail.com' }),
        ).resolves.toBe(undefined);
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.mkdirSync).toHaveBeenCalled();
        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(fs.appendFileSync).not.toHaveBeenCalled();
      });

      it('should just subscribe user if data file is exists', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'appendFileSync').mockImplementation(() => {
          return;
        });

        await expect(
          service.subscribe({ email: 'test@gmail.com' }),
        ).resolves.toBe(undefined);
        expect(fs.existsSync).toHaveBeenCalled();
        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(fs.appendFileSync).toHaveBeenCalled();
      });

      it('should throw error if email is already exists', async () => {
        const email = 'me@kurovskyi.dev';

        jest
          .spyOn(service, 'getAllSubscribers')
          .mockReturnValue(Promise.resolve([email]));

        await expect(service.subscribe({ email })).rejects.toThrow(
          SubscriptionConflictException,
        );
        expect(fs.existsSync).not.toHaveBeenCalled();
        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(fs.appendFileSync).not.toHaveBeenCalled();
      });
    });

    describe('send emails', () => {
      it('should send emails', async () => {
        jest.spyOn(mockRateService, 'getRate');
        jest.spyOn(mockMailService, 'sendNewRate');
        jest
          .spyOn(service, 'getAllSubscribers')
          .mockReturnValue(Promise.resolve(['me@kurovskyi.dev']));

        await expect(service.sendEmails()).resolves.toBe(undefined);
        expect(service.getAllSubscribers).toHaveBeenCalled();
        expect(mockRateService.getRate).toHaveBeenCalled();
        expect(mockMailService.sendNewRate).toHaveBeenCalled();
      });
    });
  });
});
