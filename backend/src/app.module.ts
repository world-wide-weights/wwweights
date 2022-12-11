import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsCommandsModule } from './CommandModule/items.commands.module';
import { Item } from './CommandModule/models/item.model';
import { ItemsQueriesModule } from './QueryModule/queries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        synchronize: true,
        useNewUrlParser: true,
        autoLoadEntities: true,
        useUnifiedTopology: true,
        entities: [Item],
      }),
      inject: [ConfigService],
    }),
    ItemsCommandsModule,
    ItemsQueriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
