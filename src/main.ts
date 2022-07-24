import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { initSwagger } from './inits';
import { SharedModule } from './modules/shared/shared.module';
import { AppConfigService } from './modules/shared/services';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  const appConfig = app.select(SharedModule).get(AppConfigService);

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
