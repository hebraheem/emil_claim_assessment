import { Controller } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import {
  CLAIM_SERVICE_NAME,
  ClaimServiceController,
  ClaimServiceControllerMethods,
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
import { GrpcMethod } from '@nestjs/microservices';

@Controller('claims')
@ClaimServiceControllerMethods()
export class ClaimsController implements ClaimServiceController {
  constructor(private readonly claimsService: ClaimsService) {}

  @GrpcMethod(CLAIM_SERVICE_NAME, 'CreateClaim')
  async createClaim(request: CreateClaimRequest): Promise<CreateClaimResponse> {
    return this.claimsService.createClaim(request);
  }

  @GrpcMethod(CLAIM_SERVICE_NAME, 'GetClaim')
  async getClaim(request: GetClaimRequest): Promise<GetClaimResponse> {
    return this.claimsService.getClaim(request);
  }

  @GrpcMethod(CLAIM_SERVICE_NAME, 'GetClaims')
  async getClaims(request: GetClaimsRequest): Promise<GetClaimsResponse> {
    return this.claimsService.getClaims(request);
  }

  @GrpcMethod(CLAIM_SERVICE_NAME, 'UpdateClaim')
  async updateClaim(request: UpdateClaimRequest): Promise<UpdateClaimResponse> {
    return this.claimsService.updateClaim(request);
  }

  @GrpcMethod(CLAIM_SERVICE_NAME, 'DeleteClaim')
  async deleteClaim(request: DeleteClaimRequest): Promise<DeleteClaimResponse> {
    return this.claimsService.deleteClaim(request);
  }
}
