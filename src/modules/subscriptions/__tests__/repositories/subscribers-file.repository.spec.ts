import * as fs from 'fs';

import { Test, TestingModule } from '@nestjs/testing';

import {
  ISubscribersRepository,
  SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
} from '../../interfaces';
import { SubscribersFileRepository } from '../../repositories';

jest.mock('fs');

describe('SubscribersFileRepository', () => {
  let repository: ISubscribersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
          useClass: SubscribersFileRepository,
        },
      ],
    }).compile();

    repository = module.get(SUBSCRIBERS_REPOSITORY_INTERFACE_KEY);
  });

  describe('base checks', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('methods', () => {
    describe('get all', () => {
      it('should get all subscribers if data file is exists and full', async () => {
        const mockFileEmails = ['test@example.com', 'test@example.com'];

        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest
          .spyOn(fs, 'readFileSync')
          .mockReturnValue(mockFileEmails.join('\n'));

        await expect(repository.getAll()).resolves.toEqual(mockFileEmails);
      });

      it('should get all subscribers if data file is exists and empty', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'readFileSync').mockReturnValue('');

        await expect(repository.getAll()).resolves.toEqual([]);
      });

      it('should get all subscribers if data file is not exists', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);

        await expect(repository.getAll()).resolves.toEqual([]);
      });
    });

    describe('save', () => {
      it('should create data file if is not exists and subscribe user', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        jest.spyOn(fs, 'mkdirSync').mockImplementation();
        jest.spyOn(fs, 'writeFileSync').mockImplementation();

        await expect(
          repository.save({ email: 'test@gmail.com' }),
        ).resolves.toBe(undefined);
        expect(fs.appendFileSync).not.toHaveBeenCalled();
      });

      it('should just subscribe user if data file is exists', async () => {
        jest.spyOn(fs, 'existsSync').mockReturnValue(true);
        jest.spyOn(fs, 'appendFileSync').mockImplementation(() => {
          return;
        });

        await expect(
          repository.save({ email: 'test@gmail.com' }),
        ).resolves.toBe(undefined);
        expect(fs.appendFileSync).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
        );
      });
    });
  });
});
