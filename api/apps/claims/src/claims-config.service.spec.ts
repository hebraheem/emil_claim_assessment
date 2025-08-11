/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ClaimsConfigService } from './claims-config.service';
import { PrismaService } from './prisma/prisma.service';

describe('ClaimsConfigService', () => {
  let service: ClaimsConfigService;
  let prismaService: any;

  beforeEach(() => {
    prismaService = {
      claimConfig: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new ClaimsConfigService(prismaService as PrismaService);
    jest.clearAllMocks();
  });

  describe('updateConfig', () => {
    it('should upsert config and return success', async () => {
      const dto = { request: [{ id: '1', title: 'Test' }] };
      const fakeConfig = { id: 'default', request: dto.request };
      prismaService.claimConfig.upsert.mockResolvedValue(fakeConfig);

      const result = await service.updateConfig(dto as any);

      expect(prismaService.claimConfig.upsert).toHaveBeenCalledWith({
        where: { id: 'default' },
        update: { request: dto.request },
        create: { id: 'default', request: dto.request },
      });
      expect(result).toEqual({
        data: dto.request,
        message: 'Config saved successfully',
        success: true,
        status: 200,
      });
    });

    it('should handle errors and return error response', async () => {
      prismaService.claimConfig.upsert.mockRejectedValue(new Error('db error'));

      const dto = { request: [] };
      const result = await service.updateConfig(dto as any);

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(result.message).toContain('db error');
    });
  });

  describe('getConfig', () => {
    it('should get config from db and return data', async () => {
      const fakeData = [{ id: '1', title: 'Test' }];
      prismaService.claimConfig.findUnique.mockResolvedValue({
        id: 'default',
        request: fakeData,
      });

      const result = await service.getConfig();

      expect(prismaService.claimConfig.findUnique).toHaveBeenCalledWith({
        where: { id: 'default' },
      });
      expect(result).toEqual({
        data: fakeData,
        message: 'Configuration updated successfully',
        success: true,
        status: 200,
      });
    });

    it('should handle errors and return error response', async () => {
      prismaService.claimConfig.findUnique.mockRejectedValue(
        new Error('read error'),
      );

      const result = await service.getConfig();

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(result.message).toContain('read error');
    });
  });
});
