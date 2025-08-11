/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { PrismaService } from './prisma/prisma.service';
import { ClaimsConfigService } from './claims-config.service';
import { RpcException } from '@nestjs/microservices';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        {
          provide: PrismaService,
          useValue: {
            claim: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: ClaimsConfigService,
          useValue: {
            getConfig: jest.fn().mockResolvedValue({ data: [] }),
          },
        },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
    prisma = module.get(PrismaService);
  });

  describe('createClaim', () => {
    it('should create a claim and return response', async () => {
      (prisma.claim.create as jest.Mock).mockResolvedValue({ id: 1 });
      const req: any = { userId: 1, attributes: {} };
      const result = await service.createClaim(req);
      expect(prisma.claim.create).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Claim created successfully');
    });

    it('should throw RpcException if claim creation fails', async () => {
      (prisma.claim.create as jest.Mock).mockResolvedValue(null);
      const req: any = { userId: 1, attributes: {} };
      await expect(service.createClaim(req)).rejects.toBeInstanceOf(
        RpcException,
      );
    });
  });

  describe('updateClaim', () => {
    it('should update a claim and return response', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        claimId: 1,
        userId: 1,
      });
      (prisma.claim.update as jest.Mock).mockResolvedValue({
        claimId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        attributes: {},
        rejectionReason: null,
      });
      const req: any = { claimId: 1, userId: 1, attributes: {} };
      const result = await service.updateClaim(req);
      expect(prisma.claim.update).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Claim updated successfully');
    });

    it('should throw RpcException if claim not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);
      const req: any = { claimId: 1, userId: 1, attributes: {} };
      await expect(service.updateClaim(req)).rejects.toBeInstanceOf(
        RpcException,
      );
    });
  });

  describe('getClaim', () => {
    it('should return claim if found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        claimId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        attributes: {},
        rejectionReason: null,
      });
      const req: any = { claimId: '1', userId: 1 };
      const result = await service.getClaim(req);
      expect(result).toHaveProperty('message', 'Claim retrieved successfully');
    });

    it('should throw RpcException if claim not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);
      const req: any = { claimId: '1', userId: 1 };
      await expect(service.getClaim(req)).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('getClaims', () => {
    it('should return paginated claims', async () => {
      (prisma.claim.findMany as jest.Mock).mockResolvedValue([
        {
          claimId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          attributes: {},
          rejectionReason: null,
        },
      ]);
      (prisma.claim.count as jest.Mock).mockResolvedValue(1);
      const req: any = { page: 1, pageSize: 10 };
      const result = await service.getClaims(req);
      expect(result).toHaveProperty('claims');
      expect(result.meta).toHaveProperty('total', 1);
    });
  });

  describe('deleteClaim', () => {
    it('should delete claim if found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue({
        claimId: 1,
        userId: 1,
        status: 'OPEN',
      });
      (prisma.claim.delete as jest.Mock).mockResolvedValue({});
      const req: any = { claimId: '1', userId: 1 };
      const result = await service.deleteClaim(req);
      expect(prisma.claim.delete).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Claim deleted successfully');
    });

    it('should throw RpcException if claim not found', async () => {
      (prisma.claim.findUnique as jest.Mock).mockResolvedValue(null);
      const req: any = { claimId: '1', userId: 1 };
      await expect(service.deleteClaim(req)).rejects.toBeInstanceOf(
        RpcException,
      );
    });
  });
});
