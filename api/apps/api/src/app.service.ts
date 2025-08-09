import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CLAIM_CONFIG_SERVICE_NAME,
  CLAIM_SERVICE_NAME,
  ClaimConfigResponseDto,
  ClaimConfigServiceClient,
  ClaimConfigUpdateRequestDto,
  CLAIMS_PACKAGE_NAME,
  ClaimServiceClient,
  CreateClaimRequest,
  CreateClaimResponse,
  DeleteClaimRequest,
  DeleteClaimResponse,
  GetClaimRequest,
  GetClaimResponse,
  GetClaimsRequest,
  GetClaimsResponse,
  UpdateClaimRequest,
  UpdateClaimResponse,
} from 'proto';

@Injectable()
export class AppService implements OnModuleInit {
  private claimConfigService: ClaimConfigServiceClient;
  private claimService: ClaimServiceClient;

  /**
   * Injects the gRPC client for the claims service.
   * @param {ClientGrpc} client - The gRPC client to interact with the claims service.
   */
  constructor(@Inject(CLAIMS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.claimService =
      this.client.getService<ClaimServiceClient>(CLAIM_SERVICE_NAME);
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

  /**
   * Retrieves the claim service client.
   * @param {GetClaimRequestDto} request - The request object for getting a claim.
   * @returns {Promise<GetClaimResponseDto>} A promise that resolves to GetClaimResponseDto.
   */
  async getClaim(request: GetClaimRequest): Promise<GetClaimResponse> {
    return firstValueFrom(this.claimService.getClaim(request));
  }

  /**
   * Retrieves the claims service client.
   * @param {GetClaimsRequest} request - The request object for getting claims.
   * @returns {Promise<GetClaimsResponse>} A promise that resolves to GetClaimResponseDto containing the claims data.
   */
  async getClaims(request: GetClaimsRequest): Promise<GetClaimsResponse> {
    return firstValueFrom(this.claimService.getClaims(request));
  }

  /**
   * Creates a new claim.
   * @param {CreateClaimRequest} request - The request object for creating a claim.
   * @returns {Promise<CreateClaimResponse>} A promise that resolves to GetClaimResponseDto containing the created claim data.
   */
  async createClaim(request: CreateClaimRequest): Promise<CreateClaimResponse> {
    return firstValueFrom(this.claimService.createClaim(request));
  }

  /**
   * Updates an existing claim.
   * @param {UpdateClaimRequest} request - The request object for updating a claim.
   * @returns {Promise<UpdateClaimResponse>} A promise that resolves to GetClaimResponseDto containing the updated claim data.
   */
  async updateClaim(request: UpdateClaimRequest): Promise<UpdateClaimResponse> {
    return firstValueFrom(this.claimService.updateClaim(request));
  }

  /**
   * Deletes a claim.
   * @param {DeleteClaimRequest} request - The request object for deleting a claim.
   * @returns {Promise<DeleteClaimResponse>} A promise that resolves to GetClaimResponseDto confirming the deletion.
   */
  async deleteClaim(request: DeleteClaimRequest): Promise<DeleteClaimResponse> {
    return firstValueFrom(this.claimService.deleteClaim(request));
  }
}
