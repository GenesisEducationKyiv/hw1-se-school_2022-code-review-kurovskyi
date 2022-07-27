import { BadRequestException } from '@nestjs/common';

export class RateNotFoundException extends BadRequestException {
  constructor(error?: string) {
    super('error.rateBadRequest', error);
  }
}
