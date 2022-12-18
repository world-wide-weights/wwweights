import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCommandsModule } from './commands.module/commands.module';
import { Item } from './models/item.model';
import { ItemsQueriesModule } from './queries.module/queries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mongodb',
          authSource: 'admin',
          host: configService.get('DB_MONGO_HOST'),
          port: +configService.get('DB_MONGO_PORT'),
          username: configService.get('DB_MONGO_USER'),
          password: configService.get('DB_MONGO_PW'),
          database: configService.get('DB_MONGO_NAME'),
          // TODO: Remove this option in production:
          // Only enable this option if your application is in development,
          // otherwise use TypeORM migrations to sync entity schemas:
          // https://typeorm.io/#/migrations
          synchronize: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          entities: [Item],
        };
      },
      inject: [ConfigService],
    }),
    ItemsCommandsModule,
    ItemsQueriesModule,
  ],
})
export class AppModule {}
