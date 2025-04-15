import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './example/example.module';

export const swaggerConfig = app => {
  const options = new DocumentBuilder()
    .setTitle('OPEN AI')
    .setDescription('The OPEN AI API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfig(app);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();