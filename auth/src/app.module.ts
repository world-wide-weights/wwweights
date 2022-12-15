import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './db/entities/users.entity';
import { SharedModule } from './shared/shared.module';
import { AccountModule } from './account/account.module';
import { MailModule } from './mail/mail.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PW'),
        database: configService.get<string>('DB_DB'),
        entities: [UserEntity],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    AccountModule,
    MailModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
