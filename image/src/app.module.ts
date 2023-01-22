import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { pathBuilder } from './shared/helpers/file-path.helpers';
import { ServeFileTypeMiddleware } from './serve/middlewares/serve-file-type.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UploadModule,
    SharedModule,
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: pathBuilder(
            configService.get<string>('IMAGE_STORE_BASE_PATH'),
            'disk',
          ),
          serveRoot: '/serve',
          serveStaticOptions: {
            // Prevent weird dotfile stuff
            dotfiles: 'ignore',
            // Dont try to serve index.html => Does not exist for this use case
            index: false,
            fallthrough: true,
          },
        },
      ],
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ServeFileTypeMiddleware)
      .forRoutes({ path: '/serve/*', method: RequestMethod.GET });
  }
}
