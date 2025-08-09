import { Body, Controller } from '@nestjs/common';
import { ClaimsConfigService } from './claims-config.service';
import { GrpcMethod } from '@nestjs/microservices';

import {
  CLAIM_CONFIG_SERVICE_NAME,
  ClaimConfigResponseDto,
  ClaimConfigServiceController,
  ClaimConfigServiceControllerMethods,
  ClaimConfigUpdateRequestDto,
} from 'proto';

@Controller('claims-config')
@ClaimConfigServiceControllerMethods()
export class ClaimsConfigController implements ClaimConfigServiceController {
  constructor(private readonly claimsConfigService: ClaimsConfigService) {}

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  @GrpcMethod(CLAIM_CONFIG_SERVICE_NAME, 'GetClaimConfig')
  getClaimConfig(): Promise<ClaimConfigResponseDto> {
    return this.claimsConfigService.getConfig();
  }

  /**
   * Updates the claim configuration.
   * @param {ClaimConfigUpdateRequestDto} body - The request body containing the configuration data to update.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto confirming the update.
   */
  // @UsePipes(UserAuthPipe)
  @GrpcMethod(CLAIM_CONFIG_SERVICE_NAME, 'UpdateClaimConfig')
  async updateClaimConfig(
    body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    return this.claimsConfigService.updateConfig(body);
  }
}
