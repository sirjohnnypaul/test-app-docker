import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './swagger-init.function';
import { ApiModel } from './models/api.model';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { KafkaService } from './business-layer/kafka/kafka.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableCors();
  const kafkaService = app.get(KafkaService);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await kafkaService.emailProgressListener().catch((error) => {console.log("ERROR STARTING LISTENER",error)});
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new ApiModel.ValidationDTOError(errors);
      },
    }),
  );

  swaggerInit(app); // enables apidoc
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  const port: number = process.env.APP_PORT ? +process.env.APP_PORT : 3000;
  await app.listen(port);
  console.log(`App launched on port ${port}`);
}
bootstrap();
