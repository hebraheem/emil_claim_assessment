import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma';
/**
 *
 *
 * @export
 * @class PrismaService
 * @extends {PrismaClient}
 * @description
 * This service is a global Prisma client that connects to the database.
 * It is configured with the database URL from the environment variables.
 * It logs queries, info, warnings, and errors in a pretty format.
 * The PrismaClient is extended to allow for dependency injection in other parts of the application.
 * It is marked as a global service, meaning it can be injected anywhere in the application without
 * needing to import it in every module.
 * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client Prisma Client Documentation}
 * @see {@link https://docs.nestjs.com/techniques/database Prisma with NestJS}
 * @usage
 * This service can be injected into any other service or controller in the application to interact with the
 * database using Prisma Client methods.
 * For example, you can use it to create, read, update, or delete records in the database.
 * @example
 * ```typescript
 * import { PrismaService } from './prisma.service';
 * import { Injectable } from '@nestjs/common';
 * @Injectable()
 * export class UserService {
 *   constructor(private readonly prisma: PrismaService) {}
 *  async createUser(data: CreateUserDto) {
 *    return this.prisma.user.create({})
 *  }
 * }
 * ```
 */
@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
