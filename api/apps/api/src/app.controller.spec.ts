/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: jest.Mocked<AppService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getConfig: jest.fn(),
            updateConfig: jest.fn(),
            createClaim: jest.fn(),
            getClaim: jest.fn(),
            getClaims: jest.fn(),
            updateClaim: jest.fn(),
            deleteClaim: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return config from service', async () => {
    const mockRes = { data: [], message: 'ok', success: true, status: 200 };
    service.getConfig.mockResolvedValue(mockRes as any);
    await expect(controller.getConfig()).resolves.toBe(mockRes);
    expect(service.getConfig).toHaveBeenCalled();
  });

  it('should update config via service', async () => {
    const dto = { request: [] };
    const mockRes = {
      data: [],
      message: 'updated',
      success: true,
      status: 200,
    };
    service.updateConfig.mockResolvedValue(mockRes);
    await expect(controller.updateConfig(dto as any)).resolves.toBe(mockRes);
    expect(service.updateConfig).toHaveBeenCalledWith(dto);
  });

  it('should create claim via service', async () => {
    const req = { userId: 1 };
    const mockRes = { claimId: 1 };
    service.createClaim.mockResolvedValue(mockRes as any);
    await expect(controller.createClaim(req as any)).resolves.toBe(mockRes);
    expect(service.createClaim).toHaveBeenCalledWith(req);
  });

  it('should get claim via service', async () => {
    const req = { claimId: '1', userId: 1 };
    const mockRes = { claim: { claimId: 1 } };
    service.getClaim.mockResolvedValue(mockRes as any);
    await expect(controller.getClaim(req as any, '1')).resolves.toBe(mockRes);
    expect(service.getClaim).toHaveBeenCalledWith({ ...req, claimId: '1' });
  });

  it('should get claims via service', async () => {
    const req = {};
    const mockRes = { claims: [] };
    service.getClaims.mockResolvedValue(mockRes as any);
    await expect(
      controller.getClaims(req as any, '1', '10', 'OPEN', 'search'),
    ).resolves.toBe(mockRes);
    expect(service.getClaims).toHaveBeenCalledWith({
      ...req,
      page: 1,
      pageSize: 10,
      status: 'OPEN',
      search: 'search',
    });
  });

  it('should update claim via service', async () => {
    const req = { claimId: 1 };
    const mockRes = { updatedClaim: { claimId: 1 } };
    service.updateClaim.mockResolvedValue(mockRes as any);
    await expect(controller.updateClaim(req as any, '1')).resolves.toBe(
      mockRes,
    );
    expect(service.updateClaim).toHaveBeenCalledWith({ ...req, claimId: 1 });
  });

  it('should delete claim via service', async () => {
    const req = { claimId: '1' };
    const mockRes = { message: 'deleted' };
    service.deleteClaim.mockResolvedValue(mockRes as any);
    await expect(controller.deleteClaim(req as any, '1')).resolves.toBe(
      mockRes,
    );
    expect(service.deleteClaim).toHaveBeenCalledWith({ ...req, claimId: '1' });
  });
});
