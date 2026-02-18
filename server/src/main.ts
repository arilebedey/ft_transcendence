import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { toNodeHandler } from 'better-auth/node';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Disable NestJS's built-in body parser so we can control ordering
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Access Express instance
  const expressApp = app.getHttpAdapter().getInstance();

  // Access BetterAuth instance from AuthService
  const authService = app.get<AuthService>(AuthService);

  // Mount BetterAuth before body parsers
  expressApp.all(
    /^\/api\/auth\/.*/,
    toNodeHandler(authService.instance.handler),
  );

  // Validates against your DTO schema
  // Protects against accidental extra fields & prevents malicious injection of unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Re-enable Nest's JSON body parser AFTER mounting BetterAuth
  expressApp.use(require('express').json());

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
