import { ConflictException } from '@nestjs/common';

export class SubscriptionConflictException extends ConflictException {
  constructor(initialError?: unknown) {
    super({ type: 'error.subscriptionConflict', initialError });
  }
}
