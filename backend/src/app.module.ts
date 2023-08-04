import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from './utils/exceptions/all-exception.filter';
import { BUSINESS_LAYER_MODULES } from './business-layer';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required().integer().default(3000),
        DATABASE_USER: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_NAME: Joi.required(),
        DATABASE_PORT: Joi.number().default(3306),
        DATABASE_HOST: Joi.required(),
        IMPORT_MOCKS: Joi.boolean(),
      }),
      envFilePath: `./environments/${process.env.NODE_ENV || ''}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: false,
      synchronize: false,
      dropSchema: false,
      //dropSchema: process.env.IMPORT_MOCKS?.toLowerCase() === 'true',
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          return `${timestamp} [${level}] : ${JSON.stringify(message)} `;
        }),
      ),
      transports: [
        ...(process.env.NODE_ENV === 'prod'
          ? [
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
              }),
              new winston.transports.File({ filename: 'logs/combined.log' }),
              new winston.transports.Console({}),
            ]
          : [
              new winston.transports.Console({
                format: winston.format.simple(),
              }),
            ]),
      ],
    }),
    ...BUSINESS_LAYER_MODULES,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.NODE_ENV);
  }
}
