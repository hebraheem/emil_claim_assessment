import { Injectable } from '@nestjs/common';
import { ClaimConfigResponseDto, ClaimConfigUpdateRequestDto } from 'proto';

import config from '../claim-config.json';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class ClaimsConfigService {
  private mockConfig = config;

  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  updateConfig(
    body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    return Promise.resolve({
      data: body.request,
      message: 'Configuration updated successfully',
      success: true,
      status: 200,
    });
  }

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  getConfig(): Promise<ClaimConfigResponseDto> {
    return Promise.resolve({
      data: this.mockConfig,
      message: 'Configuration updated successfully',
      success: true,
      status: 200,
    });
  }
}
