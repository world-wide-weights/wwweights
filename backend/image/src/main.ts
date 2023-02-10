import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('World Wide Weights - Image API')
      .setDescription('The wwweights image service overview')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('swagger', app, document);
  }
  app.enableCors();
  await app.listen(process.env.port || 3003);
}
bootstrap();
