import { NestFactory } from '@nestjs/core';
import { ClaimsModule } from './claims.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CLAIMS_PACKAGE_NAME } from 'proto';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrapGrpc() {
  const grpcHost = process.env.CLAIMS_SERVICE_HOST || 'localhost';
  const grpcPort = process.env.CLAIMS_SERVICE_PORT || '50051';

  const url = `0.0.0.0:${grpcPort}`; // server binds to all interfaces

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
  console.log(`gRPC server listening on ${grpcHost}:${grpcPort}`);
}

void bootstrapGrpc();
