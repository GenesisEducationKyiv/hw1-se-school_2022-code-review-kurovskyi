import { Email } from '../../../common/types';

export const SUBSCRIBERS_REPOSITORY_INTERFACE_KEY = 'ISubscribersRepository';

export interface ISubscribersRepository {
  getAll(): Promise<Email[]>;

  save({ email }: { email: Email }): Promise<void>;
}
