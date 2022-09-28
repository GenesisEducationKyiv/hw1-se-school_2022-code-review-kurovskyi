import { BadRequestException } from '@nestjs/common';

export class RateBadRequestException extends BadRequestException {
  constructor(initialError?: unknown) {
    super({
      type: 'error.rateBadRequest',
      initialError: (initialError as Error)?.message,
    });
  }
}
