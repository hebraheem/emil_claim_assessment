import { Injectable } from '@nestjs/common';
import { ClaimConfigResponseDto, ClaimConfigUpdateRequestDto } from 'proto';

import path from 'path';
import * as fs from 'fs';

@Injectable()
export class ClaimsConfigService {
  private filePath = path.join('../', 'storage', 'claim-config.json');

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  async updateConfig(
    body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    try {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });

      // Write JSON to file
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(body.request, null, 2),
        'utf-8',
      );

      return Promise.resolve({
        data: body.request,
        message: `Config saved to ${this.filePath}`,
        success: true,
        status: 200,
      });
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
      const config = fs.readFileSync(this.filePath, 'utf-8');
      return Promise.resolve({
        data: JSON.parse(config) as ClaimConfigResponseDto['data'],
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
