import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { MailService } from '../mail.service';

class MockMailerService {
  async sendMail(): Promise<void> {
    return;
  }
}

describe('MailService', () => {
  let service: MailService;

  let mockMailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useClass: MockMailerService },
      ],
    }).compile();

    service = module.get(MailService);
    mockMailerService = module.get(MailerService);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('send new rate', () => {
      const rate = 10;

      it('should send new rate to one email', async () => {
        const email = 'example@gmail.com';

        jest.spyOn(mockMailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: email, data: { rate } }),
        ).resolves.toBe(undefined);
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      });

      it('should send new rate to the multiple emails', async () => {
        const emails = ['12345', 'dmytro.kurovskyi@gmail.com'];

        await expect(
          service.sendNewRate({ to: emails, data: { rate } }),
        ).resolves.toBe(undefined);
      });

      // it('should work on empty array emails', async () => {
      //   const emails = [];

      //   await expect(
      //     service.sendNewRate({ to: emails, data: { rate } }),
      //   ).resolves.toBe(undefined);
      // });

      // it('should throw an error on empty email string', async () => {
      //   const email = '';

      //   await expect(
      //     service.sendNewRate({ to: email, data: { rate } }),
      //   ).rejects.toMatch('error');
      // });

      // it('should throw an error on incorrect email string', async () => {
      //   const email = '12345';

      //   await expect(
      //     service.sendNewRate({ to: email, data: { rate } }),
      //   ).rejects.toMatch('error');
      // });

      // it('should throw an error on incorrect emails array', async () => {
      //   const emails = ['12345', 'gmail'];

      //   await expect(
      //     service.sendNewRate({ to: emails, data: { rate } }),
      //   ).rejects.toMatch('error');
      // });
    });
  });
});
