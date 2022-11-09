import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
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
        host: 'localhost', //configService.get('DB_HOST'),
        //port: +'5432', //configService.get('DB_PORT'),
        username: 'admin', //configService.get('DB_USER'),
        password: 'admin', //configService.get('DB_PW'),
        database: 'wwweights', //configService.get('DB_DB'),
        entities: [Item],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
