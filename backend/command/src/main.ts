import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('commands/v1');

  // Swagger
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('World Wide Weights - Command API')
      .setDescription('The wwweights Api overview')
      .setVersion('0.1')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('swagger', app, document);
  }
  app.enableCors();
  await app.listen(process.env.port || 3002);
}
bootstrap();
