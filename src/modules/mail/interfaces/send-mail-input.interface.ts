import { Email } from '../../../common/types';

export interface SendMailInput<T = never> {
  to: Email | Email[];
  data: T;
}
