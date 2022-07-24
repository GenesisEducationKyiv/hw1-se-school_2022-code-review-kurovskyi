import { Global, Module } from '@nestjs/common';

import { AppConfigService } from './services';

const providers = [AppConfigService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
