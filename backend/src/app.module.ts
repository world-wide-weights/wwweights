import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommandsModule } from './commands.module/commands.module';
import { QueriesModule } from './queries.module/queries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          authSource: 'admin',
          uri: `mongodb://${configService.get(
            'DB_MONGO_USER',
          )}:${configService.get('DB_MONGO_PW')}@${configService.get(
            'DB_MONGO_HOST',
          )}:${configService.get('DB_MONGO_PORT')}/${configService.get(
            'DB_MONGO_NAME',
          )}`,
        };
      },
      inject: [ConfigService],
    }),
    CommandsModule,
    QueriesModule,
  ],
})
export class AppModule {}
