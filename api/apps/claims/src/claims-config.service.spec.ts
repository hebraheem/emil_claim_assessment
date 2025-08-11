/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ClaimsConfigService } from './claims-config.service';
import * as fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('ClaimsConfigService', () => {
  let service: ClaimsConfigService;

  beforeEach(() => {
    service = new ClaimsConfigService();
    jest.clearAllMocks();
  });

  describe('updateConfig', () => {
    it('should write config to file and return success', async () => {
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      const dto = { request: [{ id: '1', title: 'Test' }] };
      const result = await service.updateConfig(dto as any);

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        path.dirname(service['filePath']),
        { recursive: true },
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        service['filePath'],
        JSON.stringify(dto.request, null, 2),
        'utf-8',
      );
      expect(result).toEqual({
        data: dto.request,
        message: 'Config saved successfully',
        success: true,
        status: 200,
      });
    });

    it('should handle errors and return error response', async () => {
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('mkdir error');
      });

      const dto = { request: [] };
      const result = await service.updateConfig(dto as any);

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(result.message).toContain('mkdir error');
    });
  });

  describe('getConfig', () => {
    it('should read config from file and return data', async () => {
      const fakeData = [{ id: '1', title: 'Test' }];
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(fakeData));

      const result = await service.getConfig();

      expect(fs.readFileSync).toHaveBeenCalledWith(
        service['filePath'],
        'utf-8',
      );
      expect(result).toEqual({
        data: fakeData,
        message: 'Configuration updated successfully',
        success: true,
        status: 200,
      });
    });

    it('should handle errors and return error response', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('read error');
      });

      const result = await service.getConfig();

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(result.message).toContain('read error');
    });
  });
});
