import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/http-filter.exception';
import { UserIdInterceptor } from './interceptors/user-id.interceptor';

async function bootstrapHttp() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new UserIdInterceptor());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const httpPort = process.env.PORT || 5172;
  await app.listen(httpPort);
  console.log(`HTTP server listening on port ${httpPort}`);
}

void bootstrapHttp();
