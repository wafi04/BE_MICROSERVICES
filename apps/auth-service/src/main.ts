import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0', // This allows connections from other containers
        port: Number(process.env.AUTH_SERVICE_PORT) || 3001,
      },
    },
  );
  await app.listen();
}
bootstrap();
