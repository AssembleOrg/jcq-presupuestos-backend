import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  const port = configService.get<number>('port');
  const nodeEnv = configService.get<string>('nodeEnv');
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  const swaggerPassword = configService.get<string>('swagger.password');
  const corsOrigin = configService.get<string>('cors.origin');

  // Security: Helmet
  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: nodeEnv === 'production' ? undefined : false,
    }),
  );
  logger.log('🛡️  Helmet security enabled');

  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  logger.log(`🌐 CORS enabled for: ${corsOrigin}`);

  // Global validation pipe with Spanish messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Permitir propiedades extra (para filtros)
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return Object.values(error.constraints || {}).join(', ');
        });
        return {
          message: messages,
          error: 'Error de validación',
          statusCode: 422, // Unprocessable Entity (más apropiado que 400)
        };
      },
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  // Setup Swagger
  if (swaggerEnabled || nodeEnv === 'development') {
    // Add basic auth for Swagger in production
    if (nodeEnv === 'production') {
      app.use(
        ['/api/docs', '/api/docs/(.*)'],
        basicAuth({
          challenge: true,
          users: {
            admin: swaggerPassword || 'admin123',
          },
        }),
      );
    }

    const config = new DocumentBuilder()
      .setTitle('JCQ Presupuestos API')
      .setDescription('API para la gestión de presupuestos en estructuras')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Autenticación', 'Endpoints de autenticación y autorización')
      .addTag('Usuarios', 'Gestión de usuarios del sistema')
      .addTag('Clientes', 'Gestión de clientes')
      .addTag('Proyectos', 'Gestión de proyectos con ubicación geográfica')
      .addTag('Pagos', 'Gestión de pagos de proyectos')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'JCQ Presupuestos - API Docs',
    });

    console.log(`📚 Swagger disponible en: http://localhost:${port}/api/docs`);
    if (nodeEnv === 'production') {
      console.log(`🔒 Usuario: admin | Contraseña: ${swaggerPassword}`);
    }
  }

  await app.listen(port || 3000);
  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port || 3000}`);
  logger.log(`🌍 Ambiente: ${nodeEnv}`);
  logger.log(`⏰ Zona horaria: America/Argentina/Buenos_Aires (GMT-3)`);
  logger.log(`🔒 Seguridad: Helmet + Rate Limiting + Error Tracking`);
  logger.log(`📊 HTTP Logging: Enabled`);
}

bootstrap();
