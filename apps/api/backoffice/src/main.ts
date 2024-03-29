/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const url = process.env.CORS_ORIGIN;
  const origin = url.includes(',') ? url.split(',') : url;
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('OS HUB API')
    .setDescription('OS HUB API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
