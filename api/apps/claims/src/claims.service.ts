import { Injectable } from '@nestjs/common';
import {
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
export class ClaimsService {
  private claims = {
    id: 'request.claimId',
    userId: 'request.userId',
    claimId: 1,
    incidentType: 'theft',
    description: 'Sample claim description',
    status: 'open',
    policyId: 'policy123',
    attributes: { key: 'value' },
    dateOfIncident: new Date().toISOString(),
    dateOfSubmission: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // This would typically be replaced with a database or persistent storage
  createClaim(request: CreateClaimRequest): Promise<CreateClaimResponse> {
    console.log('createClaim :>> ', request);
    return Promise.resolve({
      message: 'Claim created successfully',
      success: true,
      status: 201,
      claimId: 1,
    });
  }

  getClaim(request: GetClaimRequest): Promise<GetClaimResponse> {
    console.log('request :>> ', request);
    return Promise.resolve({
      message: 'Claim retrieved successfully',
      success: true,
      status: 200,
      claim: this.claims,
    });
  }

  getClaims(request: GetClaimsRequest): Promise<GetClaimsResponse> {
    console.log('getClaims :>> ', request);
    return Promise.resolve({
      message: 'Claims retrieved successfully',
      success: true,
      status: 200,
      claims: [this.claims],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  }

  updateClaim(request: UpdateClaimRequest): Promise<UpdateClaimResponse> {
    console.log('updateClaim :>> ', request);
    return Promise.resolve({
      message: 'Claim updated successfully',
      success: true,
      status: 200,
      updatedClaim: this.claims,
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  }

  deleteClaim(request: DeleteClaimRequest): Promise<DeleteClaimResponse> {
    console.log('deleteClaim :>> ', request);
    return Promise.resolve({
      message: 'Claim deleted successfully',
      success: true,
      status: 200,
    });
  }
}
