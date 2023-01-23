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
  app.setGlobalPrefix('queries/v1');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('World Wide Weights Api')
    .setDescription('The wwweights Api overview')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.port || 3004);
}
bootstrap();
