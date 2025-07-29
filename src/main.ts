import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import CONSTANTS from './common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import sessionConfig from './config/session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Remove COOP header to fix Swagger UI issues
  app.use((_, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    next();
  });

  // Security headers configuration
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI
      crossOriginEmbedderPolicy: false, // Required for Swagger UI
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Pharma API')
    .setDescription('Pharma API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token **_only_**',
        in: 'header',
      },
      CONSTANTS.ACCESS_TOKEN,
    );

  options.addServer(process.env.APP_URL, process.env.NODE_ENV);

  const config = options.build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('docs', app, document);

  // Session configuration
  app.use(sessionConfig());

  await app.listen(process.env.PORT ?? 8000, () => {
    console.log(`Server started on port ${process.env.PORT ?? 8000}`);
  });
}

bootstrap();
