import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerInit(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(' project API')
    .setDescription('The <strong></strong> project API description ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
