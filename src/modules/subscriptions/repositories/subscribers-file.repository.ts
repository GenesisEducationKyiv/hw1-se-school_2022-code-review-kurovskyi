import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';

import { Email } from '../../../common/types';

import { ISubscribersRepository } from '../interfaces';

const DATA_DIR = path.join(__dirname, '../../../../data');
const FILE_PATH = path.join(DATA_DIR, 'subscribers.txt');

@Injectable()
export class SubscribersFileRepository implements ISubscribersRepository {
  async getAll(): Promise<Email[]> {
    if (!fs.existsSync(FILE_PATH)) {
      return [];
    }

    const subscribers = fs
      .readFileSync(FILE_PATH, 'utf8')
      .split('\n')
      .filter((str) => str);

    return subscribers;
  }

  async save({ email }: { email: string }): Promise<void> {
    if (!fs.existsSync(FILE_PATH)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
      }

      return fs.writeFileSync(FILE_PATH, email, { flag: 'wx' });
    }

    fs.appendFileSync(FILE_PATH, `\n${email}`);
  }
}
