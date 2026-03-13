import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 2. Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Medaf Collection API')           // ← API title
    .setDescription('Medaf Collection Backend') // ← description
    .setVersion('1.0')                          // ← version
    .addBearerAuth()                            // ← adds JWT auth button
    .build();

  // 3. Create swagger document
  const document = SwaggerModule.createDocument(app, config);

  // 4. Serve swagger UI at /api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();