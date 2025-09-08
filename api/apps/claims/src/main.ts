import { NestFactory } from '@nestjs/core';
import { ClaimsModule } from './claims.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CLAIMS_PACKAGE_NAME } from 'proto';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrapGrpc() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ClaimsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: CLAIMS_PACKAGE_NAME,
        protoPath: join(__dirname, '../claim.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  console.log('gRPC microservice is listening on 0.0.0.0:50051');
}

void bootstrapGrpc();
