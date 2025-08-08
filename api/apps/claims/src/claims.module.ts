import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { ClaimsConfigController } from './claims-config.controller';
import { ClaimsConfigService } from './claims-config.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [ClaimsController, ClaimsConfigController],
  providers: [ClaimsService, ClaimsConfigService],
})
export class ClaimsModule {}
