import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CLAIMS_PACKAGE_NAME } from 'proto';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CLAIMS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: CLAIMS_PACKAGE_NAME,
          protoPath: join(__dirname, '../claim.proto'),
          url: '0.0.0.0:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
