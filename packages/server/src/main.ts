import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import AppModule from './app.module';
import { API_PREFIX, APP_URL, SERVER_PORT } from './common/consts';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  // Enable CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'"],
          connectSrc: ["'self'", APP_URL],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
      crossOriginEmbedderPolicy: { policy: 'require-corp' },
    })
  );

  // Enable CORS
  app.enableCors({
    origin: APP_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
  });
  await app.listen(SERVER_PORT);
}
bootstrap();
