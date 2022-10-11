import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { MailService } from '../../mail.service';
import { AppModule } from '../../../app';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get(MailService);
    mailerService = module.get(MailerService);
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
        const email = 'dmitriy_kurovsky@ukr.net';

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: email, data: { rate } }),
        ).resolves.toBe(undefined);
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      });

      it('should send new rate to the multiple emails', async () => {
        const emails = ['12345', 'dmitriy_kurovsky@ukr.net'];

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: emails, data: { rate } }),
        ).resolves.toBe(undefined);
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: emails }),
        );
      });

      it('should work on empty array emails', async () => {
        const emails = [];

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: emails, data: { rate } }),
        ).resolves.toBe(undefined);
      });

      it('should throw an error on empty email string', async () => {
        const email = '';

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: email, data: { rate } }),
        ).rejects.toThrow();
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      });

      it('should throw an error on incorrect email string', async () => {
        const email = '12345';

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: email, data: { rate } }),
        ).rejects.toThrow();
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: email }),
        );
      });

      it('should throw an error on incorrect emails array', async () => {
        const emails = ['12345', 'gmail'];

        jest.spyOn(mailerService, 'sendMail');

        await expect(
          service.sendNewRate({ to: emails, data: { rate } }),
        ).rejects.toThrow();
        expect(mailerService.sendMail).toHaveBeenCalledWith(
          expect.objectContaining({ to: emails }),
        );
      });
    });
  });
});
