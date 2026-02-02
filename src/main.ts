import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.100.86:3000',
      'http://192.168.100.10:3000',
      'http://192.168.100.113:3000',
      'http://192.168.1.151:3000',
      'https://gisuz-psi.vercel.app',
      'https://gisuz.aigov.uz',
      'https://yangitoshkentgis.aigov.uz',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Yangi Uylar API')
    .setDescription('Yangi Uylar API')
    .setVersion('3.0')
    .addBearerAuth()
    .build();

  app.use(express.json({ limit: '100mb' }));
  app.use(cookieParser());
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 2830);
}
bootstrap();
