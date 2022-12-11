import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        // TODO: implement this
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
