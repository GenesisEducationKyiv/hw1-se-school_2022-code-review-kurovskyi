import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import helmet from 'helmet';

import { initSwagger } from './inits';
import { GlobalValidationPipe } from './common/pipes';
import { SharedModule } from './modules/shared/shared.module';
import { AppConfigService } from './modules/shared/services';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  app.useGlobalPipes(new GlobalValidationPipe());

  const appConfig = app.select(SharedModule).get(AppConfigService);

  // Additional security headers
  app.use(helmet());

  if (!appConfig.isDevelopment) {
    app.enableShutdownHooks();
  }
  if (appConfig.main.documentationEnabled) {
    initSwagger(app, appConfig);
  }

  const port = appConfig.main.port;
  await app.listen(port);

  const appUrl = await app.getUrl();

  console.info(`✅ Server is running on ${appUrl}`);

  if (appConfig.main.documentationEnabled) {
    console.info(
      `📝 Documentation: http://localhost:${appConfig.main.port}/docs`,
    );
  }
}
bootstrap();
