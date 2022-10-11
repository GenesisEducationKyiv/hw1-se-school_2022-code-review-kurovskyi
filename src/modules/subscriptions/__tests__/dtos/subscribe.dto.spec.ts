import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SubscribeDto } from '../../dtos';

describe('SubscribeDto', () => {
  it('should pass the correct email', async () => {
    const dto = plainToInstance(SubscribeDto, { email: 'me@kurovskyi.dev' });
    const validationErrors = await validate(dto);

    expect(validationErrors.length).toBe(0);
  });

  it('should throws an error cause email is not a string', async () => {
    const dto = plainToInstance(SubscribeDto, {
      email: null as unknown as string,
    });
    const validationErrors = await validate(dto);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(Object.keys(validationErrors[0].constraints)).toContain('isString');
  });

  it('should throws an error cause email is empty', async () => {
    const dto = plainToInstance(SubscribeDto, { email: '' });
    const validationErrors = await validate(dto);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(Object.keys(validationErrors[0].constraints)).toContain(
      'isNotEmpty',
    );
  });

  it('should throws an error cause email is not correct', async () => {
    const dto = plainToInstance(SubscribeDto, { email: '123' });
    const validationErrors = await validate(dto);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(Object.keys(validationErrors[0].constraints)).toContain('isEmail');
  });

  it('should be trimmed and lowercase email', async () => {
    const dto = plainToInstance(SubscribeDto, { email: ' ME@kurovskyi.dev ' });
    const validationErrors = await validate(dto);

    expect(validationErrors.length).toBe(0);
    expect(dto.email).toEqual(dto.email.trim().toLowerCase());
  });
});
