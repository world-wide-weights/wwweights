import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ItemsModule } from './items/items.module';
import { GlobalStatistics } from './models/global-statistics.model';
import { ProfilesModule } from './profiles/profiles.module';
import { TagsModule } from './tags/tags.module';

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
    TypegooseModule.forFeature([GlobalStatistics]),
    TagsModule,
    ItemsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
