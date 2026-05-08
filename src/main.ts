import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow larger JSON bodies (e.g. base64 images in imageUrl)
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));

  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const basePort = Number(process.env.PORT || 3001);
  const maxAttempts = 10;

  let lastError: unknown;
  for (let i = 0; i <= maxAttempts; i += 1) {
    const port = basePort + i;
    try {
      await app.listen(port);
      // eslint-disable-next-line no-console
      console.log(`✅ Backend listening on http://localhost:${port}`);
      return;
    } catch (err: any) {
      lastError = err;
      if (err?.code !== 'EADDRINUSE') throw err;
      // eslint-disable-next-line no-console
      console.log(`Port ${port} in use, trying ${port + 1}...`);
    }
  }

  throw lastError;
}
bootstrap();