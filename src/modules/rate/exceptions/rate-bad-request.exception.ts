import { BadRequestException } from '@nestjs/common';

export class RateBadRequestException extends BadRequestException {
  constructor(error?: string) {
    super('error.rateBadRequest', error);
  }
}
