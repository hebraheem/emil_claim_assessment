// Claim DTO
export interface ClaimDto {
  claimId: number;
  userId: string;
  policyId: string;
  description: string;
  dateOfIncident: string;
  dateOfSubmission: string;
  incidentType: string;
  attributes: Record<string, string>;
  status: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

// CreateClaimRequest DTO
export interface CreateClaimRequestDto {
  policyId: string;
  description: string;
  attributes: Record<string, string>;
  dateOfIncident: string;
  dateOfSubmission: string;
  incidentType: string;
}

// CreateClaimResponse DTO
export interface CreateClaimResponseDto {
  message: string;
  success: boolean;
  status: number;
  claimId: number;
}

// GetClaimRequest DTO
export interface GetClaimRequestDto {
  claimId: number;
  userId: string;
}

// GetClaimResponse DTO
export interface GetClaimResponseDto {
  message: string;
  success: boolean;
  status: number;
  claim?: ClaimDto;
}

// GetClaimsRequest DTO
export interface GetClaimsRequestDto {
  page?: number;
  pageSize?: number;
  status?: string | number; // original code has @IsString on status but the type is number, adjusted here to string | number
}

// GetClaimsResponse DTO
export interface GetClaimsResponseDto {
  message: string;
  success: boolean;
  status: number;
  claims: ClaimDto[];
  meta: Record<string, any>;
}

// UpdateClaimRequest DTO
export interface UpdateClaimRequestDto {
  claimId: number;
  description: string;
  attributes: Record<string, string>;
  status: string;
}

// UpdateClaimResponse DTO
export interface UpdateClaimResponseDto {
  message: string;
  success: boolean;
  status: number;
  updatedClaim: ClaimDto;
  meta: Record<string, string>;
}

// DeleteClaimResponse DTO
export interface DeleteClaimResponseDto {
  message: string;
  success: boolean;
  status: number;
}
