/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ClaimConfigResponseDto } from 'proto';

import { PrismaService } from './prisma/prisma.service';
import { InputJsonValue } from 'generated/prisma/runtime/library';

@Injectable()
export class ClaimsConfigService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  async updateConfig(body: unknown): Promise<ClaimConfigResponseDto> {
    try {
      const configs = JSON.parse(
        JSON.stringify((body as { id: string; request: object }).request),
      ) as InputJsonValue;

      const createData = {
        id: 'default',
        request: configs,
      } as any;

      // Upsert config in the database
      // eslint-disable-next-line
      const config = (await this.prismaService.claimConfig.upsert({
        where: { id: 'default' },
        update: {
          request: configs,
        },
        create: createData,
      })) as { id: string; request: object };

      return {
        data:
          config && 'request' in config
            ? (config.request as unknown as ClaimConfigResponseDto['data'])
            : [],
        message: `Config saved successfully`,
        success: true,
        status: 200,
      };
    } catch (error) {
      return this.handleError(error, 'Error updating configuration');
    }
  }

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  async getConfig(): Promise<ClaimConfigResponseDto> {
    try {
      // eslint-disable-next-line
      const fetchedConfig = (await this.prismaService.claimConfig.findUnique({
        where: { id: 'default' },
      })) as { id: string; request: object };

      return Promise.resolve({
        data: fetchedConfig?.request as ClaimConfigResponseDto['data'],
        message: 'Configuration updated successfully',
        success: true,
        status: 200,
      });
    } catch (error) {
      return this.handleError(error, 'Error retrieving configuration');
    }
  }

  private handleError(error: unknown, message: string): ClaimConfigResponseDto {
    return {
      data: [],
      message:
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : message,
      success: false,
      status: 500,
    };
  }
}
