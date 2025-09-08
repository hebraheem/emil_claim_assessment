import { NestFactory } from '@nestjs/core';
import { ClaimsModule } from './claims.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CLAIMS_PACKAGE_NAME } from 'proto';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrapGrpc() {
  const url = `${process.env.CLAIMS_SERVICE_HOST! || '0.0.0.0'}:${process.env.PORT || '50051'}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ClaimsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: CLAIMS_PACKAGE_NAME,
        protoPath: join(__dirname, '../claim.proto'),
        url,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  console.log(`gRPC microservice is listening on ${url}`);
}

void bootstrapGrpc();
