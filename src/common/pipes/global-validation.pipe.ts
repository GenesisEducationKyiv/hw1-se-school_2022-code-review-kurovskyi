import { BadRequestException, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    });
  }
}
