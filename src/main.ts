import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerConfig } from './configs/swagger.config';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.setGlobalPrefix('api');
  // exception filters
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties exist
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow primitive type conversion
      },
      exceptionFactory: (errors: ValidationError[]) => {
        // Customize error response
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
      validationError: { target: false, value: false }, // Hide original object in errors
    }),
  );
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
