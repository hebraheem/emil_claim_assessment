import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule is a module that provides the PrismaService.
 * It is marked as a global module, meaning it can be injected anywhere in the application
 * without needing to import it in every module.
 * This module encapsulates the PrismaService, which is responsible for managing the Prisma client instance.
 */
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
