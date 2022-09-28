import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MailerOptions } from '@nestjs-modules/mailer';
import type { ThrottlerModuleOptions } from '@nestjs/throttler';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return !this.isProduction;
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get main() {
    return {
      port: this.getNumber('PORT'),
      apiVersion: this.getString('API_VERSION'),
      documentationEnabled: this.getBoolean('ENABLE_DOCUMENTATION'),
    };
  }

  get external() {
    return {
      rateApiProvider: this.getString('CRYPTO_CURRENCY_PROVIDER'),
      coinMarketApiKey: this.getString('COIN_MARKET_API_KEY'),
      coinRankingApiKey: this.getString('COIN_RANKING_API_KEY'),
    };
  }

  get mail(): MailerOptions {
    return {
      transport: this.getString('MAIL_TRANSPORT') || {
        host: this.getString('MAIL_HOST'),
        port: this.getNumber('MAIL_PORT'),
        auth: {
          user: this.getString('MAIL_USER'),
          pass: this.getString('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `"${this.getString('MAIL_FROM_NAME') ?? 'No Reply'}" <${
          this.getString('MAIL_FROM') ?? 'noreply@example.com'
        }>`,
      },
    };
  }

  get throttler(): ThrottlerModuleOptions {
    return {
      ttl: 30,
      limit: 10,
    };
  }
}
