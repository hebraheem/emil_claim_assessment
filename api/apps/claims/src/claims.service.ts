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
import { PrismaService } from './prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { ServiceError, status } from '@grpc/grpc-js';
import { ClaimsConfigService } from './claims-config.service';

@Injectable()
export class ClaimsService {
  constructor(
    private prismaService: PrismaService,
    private claimConfigService: ClaimsConfigService,
  ) {}

  /**
   * Creates a new claim.
   * @param {CreateClaimRequest} request - The request object for creating a claim.
   * @returns {Promise<CreateClaimResponse>} A promise that resolves to CreateClaimResponseDto containing the created claim data.
   */
  async createClaim(request: CreateClaimRequest): Promise<CreateClaimResponse> {
    request.status = 'OPEN';
    await this.validateClaimAttributes(request);
    const claim = await this.prismaService.claim.create({
      data: {
        userId: request.userId,
        incidentType: request.incidentType,
        description: request.description,
        status: request.status,
        policyId: request.policyId,
        attributes: request.attributes,
        dateOfIncident: request.dateOfIncident,
        dateOfSubmission: request.dateOfSubmission,
      },
    });
    if (!claim) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Claim creation failed for user ${request.userId}`,
      } as ServiceError);
    }

    return Promise.resolve({
      message: 'Claim created successfully',
      success: true,
      status: status.OK,
      claimId: 1,
    });
  }

  /**
   * Updates an existing claim.
   * @param {UpdateClaimRequest} request - The request object containing the claim ID and updated data.
   * @returns {Promise<UpdateClaimResponse>} A promise that resolves to UpdateClaimResponseDto containing the updated claim data.
   */
  async updateClaim(request: UpdateClaimRequest): Promise<UpdateClaimResponse> {
    await this.validateClaimAttributes(request);
    const existingClaim = await this.prismaService.claim.findUnique({
      where: {
        claimId: request.claimId,
        userId: request.userId,
        status: { not: 'IN_REVIEW' },
      },
    });
    if (!existingClaim) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Claim with ID ${request.claimId} not found or is in IN_REVIEW status`,
      } as ServiceError);
    }
    const updatedClaim = await this.prismaService.claim.update({
      where: { claimId: request.claimId },
      data: {
        userId: request.userId,
        incidentType: request.incidentType,
        description: request.description,
        status: request.status,
        attributes: request.attributes,
        dateOfIncident: request.dateOfIncident,
        dateOfSubmission: request.dateOfSubmission,
        updatedAt: new Date(),
      },
    });

    if (!updatedClaim) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Claim creation failed for user ${request.userId}`,
      } as ServiceError);
    }
    return {
      message: 'Claim updated successfully',
      success: true,
      status: status.OK,
      updatedClaim: {
        ...updatedClaim,
        createdAt: updatedClaim.createdAt.toISOString(),
        updatedAt: updatedClaim.updatedAt.toISOString(),
        attributes:
          updatedClaim.attributes && typeof updatedClaim.attributes === 'object'
            ? (updatedClaim.attributes as { [key: string]: string })
            : {},
        rejectionReason:
          updatedClaim.rejectionReason === null
            ? undefined
            : updatedClaim.rejectionReason,
      },
    };
  }

  /**
   * Retrieves a claim by its ID.
   * @param {GetClaimRequest} request - The request object containing the claim ID.
   * @returns {Promise<GetClaimResponse>} A promise that resolves to GetClaimResponseDto containing the claim data.
   */
  async getClaim(request: GetClaimRequest): Promise<GetClaimResponse> {
    return this.prismaService.claim
      .findUnique({
        where: { claimId: parseInt(request.claimId), userId: request.userId },
      })
      .then((claim) => {
        if (!claim) {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: `Claim with ID ${request.claimId} not found`,
          } as ServiceError);
        }
        return {
          message: 'Claim retrieved successfully',
          success: true,
          status: status.OK,
          claim: {
            ...claim,
            createdAt: claim.createdAt.toISOString(),
            updatedAt: claim.updatedAt.toISOString(),
            attributes:
              claim.attributes && typeof claim.attributes === 'object'
                ? (claim.attributes as { [key: string]: string })
                : {},
            rejectionReason:
              claim.rejectionReason === null
                ? undefined
                : claim.rejectionReason,
          },
        };
      });
  }

  /**
   * Retrieves a paginated list of claims based on the provided filters.
   * @param {GetClaimsRequest} request - The request object containing pagination and filter parameters.
   * @returns {Promise<GetClaimsResponse>} A promise that resolves to GetClaimsResponseDto containing the list of claims and pagination metadata.
   */
  async getClaims(request: GetClaimsRequest): Promise<GetClaimsResponse> {
    const { page = 1, pageSize = 10, userId, search } = request;

    const where: Record<string, any> = {};
    if (userId) where.userId = userId;
    if (request.status) where.status = request.status;
    if (typeof search === 'string' && search.trim() !== '') {
      where.OR = [
        { incidentType: { contains: search, mode: 'insensitive' } },
        { policyId: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [claims, total] = await Promise.all([
      this.prismaService.claim.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.claim.count({ where }),
    ]);

    return {
      message: 'Claims retrieved successfully',
      success: true,
      status: status.OK,
      claims: claims.map((claim) => ({
        ...claim,
        createdAt:
          claim.createdAt instanceof Date
            ? claim.createdAt.toISOString()
            : claim.createdAt,
        updatedAt:
          claim.updatedAt instanceof Date
            ? claim.updatedAt.toISOString()
            : claim.updatedAt,
        attributes:
          claim.attributes && typeof claim.attributes === 'object'
            ? (claim.attributes as { [key: string]: string })
            : {},
        rejectionReason:
          claim.rejectionReason === null ? undefined : claim.rejectionReason,
      })),
      meta: {
        total,
        page,
        pageSize,
      },
    };
  }

  /** Deletes a claim by its ID.
   * @param {DeleteClaimRequest} request - The request object for deleting a claim.
   * @returns {Promise<DeleteClaimResponse>} A promise that resolves to DeleteClaimResponse confirming the deletion.
   */
  async deleteClaim(request: DeleteClaimRequest): Promise<DeleteClaimResponse> {
    const claim = await this.prismaService.claim.findUnique({
      where: {
        claimId: parseInt(request.claimId),
        status: { not: 'IN_REVIEW' },
        userId: request.userId,
      },
    });

    if (!claim) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Claim with ID ${request.claimId} is either IN_REVIEW or not found`,
      } as ServiceError);
    }
    await this.prismaService.claim.delete({
      where: { claimId: parseInt(request.claimId) },
    });
    return {
      message: 'Claim deleted successfully',
      success: true,
      status: status.OK,
    };
  }

  /**
   * Validates claim attributes against the provided configuration.
   * @param {Record<string, any>} request - The attributes to validate.
   * @throws {RpcException} If validation fails.
   */
  private async validateClaimAttributes(
    request: Record<string, any>,
  ): Promise<void> {
    const config = (await this.claimConfigService.getConfig()).data as Record<
      string,
      any
    >[];

    const attributesConfigs: Record<string, any> = {};
    const attributes = request.attributes as Record<string, any>;
    const errors: string[] = [];

    config.forEach(
      (item: { configs: Record<string, unknown>; fixed: boolean }) => {
        if (!item?.fixed) {
          // Fixed attributes are validated at the top level
          Object.keys(item.configs).forEach((key) => {
            attributesConfigs[key] = item.configs[key];
          });
        } else {
          const topLevelError = this.validateTopLevelOptionsAttributes(
            request,
            config,
          );
          errors.push(...topLevelError);
        }
      },
    );

    for (const attributeKey in attributes) {
      if (!attributesConfigs[attributeKey]) {
        errors.push(`Invalid attribute ${attributeKey} provided`);
      }
    }

    Object.keys(attributesConfigs).forEach((key) => {
      const attribute = attributesConfigs[key] as {
        type: string;
        key: string;
        required: boolean;
        options: { value: string }[];
        dependsOn?: {
          key: string;
          value: string;
        };
      };

      let value: unknown = attributes[key];

      if (
        attribute?.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`Attribute ${key} is required`);
      }
      if (attribute?.type === 'select' && value) {
        const validOptions = attribute.options.map((option) => option.value);
        if (!validOptions.includes(value as string)) {
          errors.push(
            `Attribute ${key} options are ${validOptions.join(', ')} passed value is invalid`,
          );
        }
      }
      let expectedType = attribute.type;
      if (attribute?.type === 'number') {
        value = typeof value === 'string' ? parseFloat(value) : value;
      }
      if (expectedType === 'text') {
        expectedType = 'string';
      }
      if (
        typeof value !== expectedType &&
        ['string', 'boolean', 'number'].includes(expectedType) &&
        attribute?.required
      ) {
        errors.push(`Attribute ${key} must be of type ${expectedType}`);
      }

      if (attribute?.dependsOn) {
        const { key: dependsOnKey, value: dependsOnValue } =
          attribute.dependsOn;
        //!Note: i have used != instead of !== to allow for type coercion and to avoid type compatibility issues
        if (attributes[dependsOnKey] != dependsOnValue && value) {
          errors.push(
            `Attribute ${key} depends on ${dependsOnKey} being ${dependsOnValue}`,
          );
        }
      }
    });

    if (errors.length > 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: `Invalid claim attributes:\r\n${errors.join('\r\n')}`,
      } as ServiceError);
    }
  }

  /**
   * Validates top-level options attributes against the provided configuration.
   * @param {Record<string, any>} attributes - The attributes to validate.
   * @param {Record<string, any>[]} config - The configuration against which to validate the attributes.
   * @returns {string[]} An array of error messages if validation fails.
   */
  private validateTopLevelOptionsAttributes(
    attributes: Record<string, any>,
    config: Record<string, any>[],
  ): string[] {
    const errors: string[] = [];

    config.forEach((item) => {
      if (item.fixed) {
        const configs = item.configs as Record<
          string,
          {
            required: boolean;
            value: string | number | boolean;
            key: string;
            type: string;
            options: { value: string }[];
          }
        >;

        Object.keys(configs).forEach((key) => {
          const attribute = configs[key];
          if (
            attribute.required &&
            !attributes[key] &&
            key !== 'attributes' &&
            key !== 'policyId'
          ) {
            errors.push(`Attribute ${key} is required`);
          }
          if (attribute.type === 'select' && attributes[key]) {
            const validOptions = attribute.options.map(
              (option) => option.value,
            );
            if (!validOptions.includes(String(attributes[key]))) {
              errors.push(
                `Attribute ${key} options are ${validOptions.join(
                  ', ',
                )} passed value ${attributes[key]} is invalid`,
              );
            }
          }
        });
      }
    });
    return errors;
  }
}
