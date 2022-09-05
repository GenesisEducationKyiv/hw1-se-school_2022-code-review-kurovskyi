import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { AppModule } from '../../../app';
import { RateService } from '../../../rate';
import { MailService } from '../../../mail';
import { SubscriptionsService } from '../../subscriptions.service';

jest.mock('fs');

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let rateService: RateService;
  let mailService: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get(SubscriptionsService);
    rateService = module.get(RateService);
    mailService = module.get(MailService);
    mailerService = module.get(MailerService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('send emails', () => {
      it('should send emails', async () => {
        jest.spyOn(rateService, 'getRate');
        jest.spyOn(mailService, 'sendNewRate');
        jest.spyOn(mailerService, 'sendMail').mockImplementation();
        jest
          .spyOn(service, 'getAllSubscribers')
          .mockReturnValue(Promise.resolve(['dmitriy_kurovsky@ukr.net']));

        await expect(service.sendEmails()).resolves.toBe(undefined);
        expect(service.getAllSubscribers).toHaveBeenCalled();
        expect(rateService.getRate).toHaveBeenCalled();
        expect(mailService.sendNewRate).toHaveBeenCalled();
      });
    });
  });
});
