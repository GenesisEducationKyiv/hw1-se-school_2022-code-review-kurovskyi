import { ConflictException } from '@nestjs/common';

export class SubscriptionConflictException extends ConflictException {
  constructor(error?: string) {
    super('error.subscriptionConflict', error);
  }
}
