import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsCommandsModule } from './items/items.commands.module';
import { ItemsQueriesModule } from './items/items.queries.module';
import { Item } from './items/models/item.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PW'),
        database: configService.get('DB_DB'),
        entities: [Item],
        synchronize: true,
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
