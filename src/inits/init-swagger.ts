import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '../modules/shared/services';

export function initSwagger(
  app: INestApplication,
  appConfig: AppConfigService,
): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Bitcoin API')
    .setDescription(
      `The Bitcoin API is an educational project for the Genesis & KMA course.`,
    );

  if (appConfig.main.apiVersion) {
    documentBuilder.setVersion(appConfig.main.apiVersion);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
}
