import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Claim DTO
export class ClaimDto {
  @IsInt()
  claimId: number;

  @IsString()
  userId: string;

  @IsString()
  policyId: string;

  @IsString()
  description: string;

  @IsString()
  dateOfIncident: string;

  @IsString()
  dateOfSubmission: string;

  @IsString()
  incidentType: string;

  @IsObject()
  attributes: Record<string, string>;

  @IsString()
  status: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

// CreateClaimRequest DTO
export class CreateClaimRequestDto {
  @IsString()
  userId: string;

  @IsString()
  policyId: string;

  @IsString()
  description: string;

  @IsObject()
  attributes: Record<string, string>;

  @IsString()
  dateOfIncident: string;

  @IsString()
  dateOfSubmission: string;

  @IsString()
  incidentType: string;
}

// CreateClaimResponse DTO
export class CreateClaimResponseDto {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsInt()
  status: number;

  @IsInt()
  claimId: number;
}

// GetClaimRequest DTO
export class GetClaimRequestDto {
  @IsInt()
  claimId: number;

  @IsString()
  userId: string;
}

// GetClaimResponse DTO
export class GetClaimResponseDto {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsInt()
  status: number;

  @ValidateNested()
  @Type(() => ClaimDto)
  claim?: ClaimDto;
}

// GetClaimsRequest DTO
export class GetClaimsRequestDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  status?: number;
}

// GetClaimsResponse DTO
export class GetClaimsResponseDto {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsInt()
  status: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClaimDto)
  claims: ClaimDto[];

  @IsObject()
  meta: Record<string, any>;
}

// UpdateClaimRequest DTO
export class UpdateClaimRequestDto {
  @IsInt()
  claimId: number;

  @IsString()
  userId: string;

  @IsString()
  description: string;

  @IsObject()
  attributes: Record<string, string>;

  @IsString()
  status: string;
}

// UpdateClaimResponse DTO
export class UpdateClaimResponseDto {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsInt()
  status: number;

  @ValidateNested()
  @Type(() => ClaimDto)
  updatedClaim: ClaimDto;

  @IsObject()
  meta: Record<string, string>;
}

// DeleteClaimRequest DTO
export class DeleteClaimRequestDto {
  claimId: number | string;

  @IsString()
  userId: string;
}

// DeleteClaimResponse DTO
export class DeleteClaimResponseDto {
  @IsString()
  message: string;

  @IsBoolean()
  success: boolean;

  @IsInt()
  status: number;
}
