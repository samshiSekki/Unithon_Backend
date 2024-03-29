import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeywordModule } from './keyword/keyword.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { ScheduleModule } from '@nestjs/schedule';
import { APP_PIPE } from '@nestjs/core';
import { MessagesModule } from './message/message.module';
const { combine, timestamp, printf } = winston.format;

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `${process.env.DATABASE_URL}`,
      }),
    }),
    UsersModule,
    KeywordModule,
    MessagesModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm',
            }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('삼시세끼', { prettyPrint: true }),
          ),
        }),
        new DailyRotateFile({
          level: 'error',
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf(
              (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
            ),
          ),
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}
