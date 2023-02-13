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
      .addBearerAuth(
        {
          description: `JWT provided by and verfied againts auth service`,
          scheme: 'Bearer',
          type: 'http',
        },
        'jwt',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: false,
    });
    // Insert serve endpoint documentation
    // Has to be done here as serving via static is done without a controller
    document.paths['/serve/{filePath}'] = {
      get: {
        description:
          'Endpoint serving all uploaded files. As of now these are limited to images and all non-image requests will be blocked',
        responses: {
          '200': { description: 'File/Image served' },
          '404': {
            description: 'File not found or request for non image resource',
          },
        },
        parameters: [
          {
            name: 'filePath',
            in: 'path',
          },
        ],
      },
    };
    SwaggerModule.setup('swagger', app, document);
  }
  app.enableCors();
  await app.listen(process.env.port || 3003);
}
bootstrap();
