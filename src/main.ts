import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.setGlobalPrefix('api');
  // exception filters
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // swagger config
  SwaggerConfig(app);
  await app.listen(process.env.APP_PORT ?? 3000, () => {
    console.log(
      `server running at http://localhost:${process.env.APP_PORT ?? 3000}`,
    );
    console.log(
      `Swagger documentation available at http://localhost:${process.env.APP_PORT ?? 3000}/docs`,
    );
  });
}
bootstrap();
