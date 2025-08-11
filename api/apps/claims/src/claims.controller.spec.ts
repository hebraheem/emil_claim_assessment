/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
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

describe('ClaimsController', () => {
  let controller: ClaimsController;
  let service: jest.Mocked<ClaimsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [
        {
          provide: ClaimsService,
          useValue: {
            createClaim: jest.fn(),
            getClaim: jest.fn(),
            getClaims: jest.fn(),
            updateClaim: jest.fn(),
            deleteClaim: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClaimsController>(ClaimsController);
    service = module.get(ClaimsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createClaim on service', async () => {
    const req = {} as CreateClaimRequest;
    const res = {} as CreateClaimResponse;
    service.createClaim.mockResolvedValue(res);
    await expect(controller.createClaim(req)).resolves.toBe(res);
    expect(service.createClaim).toHaveBeenCalledWith(req);
  });

  it('should call getClaim on service', async () => {
    const req = {} as GetClaimRequest;
    const res = { claim: {} } as GetClaimResponse;
    service.getClaim.mockResolvedValue(res);
    await expect(controller.getClaim(req)).resolves.toBe(res);
    expect(service.getClaim).toHaveBeenCalledWith(req);
  });

  it('should call getClaims on service', async () => {
    const req = {} as GetClaimsRequest;
    const res = { claims: {} } as GetClaimsResponse;
    service.getClaims.mockResolvedValue(res);
    await expect(controller.getClaims(req)).resolves.toBe(res);
    expect(service.getClaims).toHaveBeenCalledWith(req);
  });

  it('should call updateClaim on service', async () => {
    const req = {} as UpdateClaimRequest;
    const res = { success: true } as UpdateClaimResponse;
    service.updateClaim.mockResolvedValue(res);
    await expect(controller.updateClaim(req)).resolves.toBe(res);
    expect(service.updateClaim).toHaveBeenCalledWith(req);
  });

  it('should call deleteClaim on service', async () => {
    const req = {} as DeleteClaimRequest;
    const res = { success: true } as DeleteClaimResponse;
    service.deleteClaim.mockResolvedValue(res);
    await expect(controller.deleteClaim(req)).resolves.toBe(res);
    expect(service.deleteClaim).toHaveBeenCalledWith(req);
  });
});
