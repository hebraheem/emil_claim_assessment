import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CLAIM_CONFIG_SERVICE_NAME,
  ClaimConfigResponseDto,
  ClaimConfigServiceClient,
  ClaimConfigUpdateRequestDto,
  CLAIMS_PACKAGE_NAME,
} from 'proto';

@Injectable()
export class AppService implements OnModuleInit {
  private claimConfigService: ClaimConfigServiceClient;

  constructor(@Inject(CLAIMS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.claimConfigService = this.client.getService<ClaimConfigServiceClient>(
      CLAIM_CONFIG_SERVICE_NAME,
    );
  }

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  async getConfig(): Promise<ClaimConfigResponseDto> {
    return firstValueFrom(this.claimConfigService.getClaimConfig({}));
  }

  /**
   * Updates the claim configuration.
   * @param {ClaimConfigUpdateRequestDto} body - The request body containing the configuration data to update.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto confirming the update.
   */
  async updateConfig(
    body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    return firstValueFrom(this.claimConfigService.updateClaimConfig(body));
  }
}
