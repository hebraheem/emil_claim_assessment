import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClaimConfigResponseDto,
  ClaimConfigUpdateRequestDto,
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
import { GrpcValidationPipe, UserAuthPipe } from './pipes';
import {
  CreateClaimRequestDto,
  DeleteClaimRequestDto,
  UpdateClaimRequestDto,
  VClaimConfigUpdateRequestDto,
} from './dtos';

@Controller('claims')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  @Get('config')
  @UsePipes(UserAuthPipe)
  getConfig(): Promise<ClaimConfigResponseDto> {
    return this.appService.getConfig();
  }

  /**
   * Updates the claim configuration.
   * @param {ClaimConfigUpdateRequestDto} body - The request body containing the configuration data to update.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto confirming the update.
   */
  @Put('config')
  @UsePipes(UserAuthPipe, new GrpcValidationPipe(VClaimConfigUpdateRequestDto))
  updateConfig(
    @Body() body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    return this.appService.updateConfig(body);
  }

  /**
   * Creates a new claim.
   * @param {CreateClaimRequest} request - The request object for creating a claim.
   * @returns {Promise<CreateClaimResponse>} A promise that resolves to GetClaimResponseDto containing the created claim data.
   */
  @Post()
  @UsePipes(UserAuthPipe, new GrpcValidationPipe(CreateClaimRequestDto))
  async createClaim(
    @Body() request: CreateClaimRequest,
  ): Promise<CreateClaimResponse> {
    return this.appService.createClaim(request);
  }

  /**
   * Retrieves a claim by its ID.
   * @param {GetClaimRequest} request - The request object for getting a claim.
   * @returns {Promise<GetClaimResponse>} A promise that resolves to GetClaimResponseDto containing the claim data.
   */
  @UsePipes(UserAuthPipe)
  @Get(':claimId')
  async getClaim(
    @Body() request: GetClaimRequest,
    @Param('claimId') claimId: string,
  ): Promise<GetClaimResponse> {
    if (!request) request = {} as GetClaimRequest;
    request.claimId = claimId;
    return this.appService.getClaim(request);
  }

  /**
   * Retrieves all claims.
   * @param {GetClaimsRequest} request - The request object for getting claims.
   * @returns {Promise<GetClaimsResponse>} A promise that resolves to GetClaimResponseDto containing the claims data.
   */
  @Get()
  @UsePipes(UserAuthPipe)
  async getClaims(
    @Body() request: GetClaimsRequest,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status: string,
    @Query('search') search: string,
  ): Promise<GetClaimsResponse> {
    if (!request) request = {} as GetClaimsRequest;
    request.page = page ? parseInt(page, 10) : undefined;
    request.pageSize = pageSize ? parseInt(pageSize, 10) : undefined;
    request.status = status;
    request.search = search || '';
    return this.appService.getClaims(request);
  }

  /**
   * Updates an existing claim.
   * @param {UpdateClaimRequest} request - The request object for updating a claim.
   * @returns {Promise<UpdateClaimResponse>} A promise that resolves to GetClaimResponseDto containing the updated claim data.
   */
  @Patch(':claimId')
  @UsePipes(UserAuthPipe, new GrpcValidationPipe(UpdateClaimRequestDto))
  async updateClaim(
    @Body() request: UpdateClaimRequest,
    @Param('claimId') claimId: string,
  ): Promise<UpdateClaimResponse> {
    if (!request) request = {} as UpdateClaimRequest;
    request.claimId = parseInt(claimId, 10);
    return this.appService.updateClaim(request);
  }

  /**
   * Deletes a claim.
   * @param {DeleteClaimRequest} request - The request object for deleting a claim.
   * @returns {Promise<DeleteClaimResponse>} A promise that resolves to GetClaimResponseDto confirming the deletion.
   */
  @Delete(':claimId')
  @UsePipes(UserAuthPipe, new GrpcValidationPipe(DeleteClaimRequestDto))
  async deleteClaim(
    @Body() request: DeleteClaimRequest,
    @Param('claimId') claimId: string,
  ): Promise<DeleteClaimResponse> {
    if (!request) request = {} as DeleteClaimRequest;
    request.claimId = claimId;
    return this.appService.deleteClaim(request);
  }
}
