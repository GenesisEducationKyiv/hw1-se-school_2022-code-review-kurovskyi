import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { type INestApplication, HttpStatus } from '@nestjs/common';

import { GlobalValidationPipe } from '../../../../common/pipes';
import type { Email } from '../../../../common/types';
import { AppModule } from '../../../app';
import {
  type ISubscribersRepository,
  SUBSCRIBERS_REPOSITORY_INTERFACE_KEY,
} from '../../interfaces';
import { SubscriptionConflictException } from '../../exceptions';

class MockSubscribersFileRepository implements ISubscribersRepository {
  async getAll(): Promise<Email[]> {
    return ['test@gmail.com'];
  }

  async save(): Promise<void> {
    return;
  }
}

describe('SubscriptionsModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SUBSCRIBERS_REPOSITORY_INTERFACE_KEY)
      .useClass(MockSubscribersFileRepository)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new GlobalValidationPipe());
    await app.init();
  });

  describe('POST /subscribe', () => {
    it(`OK`, async () => {
      return request(app.getHttpServer())
        .post('/subscribe')
        .send({ email: 'test2@gmail.com' })
        .expect(HttpStatus.OK);
    });

    it(`EMPTY BODY`, async () => {
      return request(app.getHttpServer())
        .post('/subscribe')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`INCORRECT EMAIL BODY`, async () => {
      return request(app.getHttpServer())
        .post('/subscribe')
        .send({ email: 'example@gmail' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it(`CONFLICT EMAIL`, async () => {
      return request(app.getHttpServer())
        .post('/subscribe')
        .send({ email: 'test@gmail.com' })
        .expect(
          HttpStatus.CONFLICT,
          JSON.stringify(new SubscriptionConflictException().getResponse()),
        );
    });
  });

  describe('POST /sendEmails', () => {
    it(`OK`, async () => {
      return request(app.getHttpServer())
        .post('/sendEmails')
        .expect(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
