/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsConfigController } from './claims-config.controller';
import { ClaimsConfigService } from './claims-config.service';
import { ClaimConfigResponseDto, ClaimConfigUpdateRequestDto } from 'proto';

const mock = [
  {
    id: '1',
    title: 'Test Config',
    description: 'Test description message',
    orderingNumber: 1,
    configs: {
      configOne: {
        orderingNumber: 1,
        key: 'configOne',
        type: 'text',
        placeholder: 'Enter value',
        label: 'Config One',
        options: [],
        defaultValue: 'defaultValue1',
        dependsOn: {
          key: 'Ä',
          value: 'true',
        },
      },
    },
  },
];

describe('ClaimsConfigController', () => {
  let controller: ClaimsConfigController;
  let service: jest.Mocked<ClaimsConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsConfigController],
      providers: [
        {
          provide: ClaimsConfigService,
          useValue: {
            getConfig: jest.fn(),
            updateConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClaimsConfigController>(ClaimsConfigController);
    service = module.get(ClaimsConfigService);
  });

  describe('getClaimConfig', () => {
    it('should return the claim config from the service', async () => {
      const mockResponse: ClaimConfigResponseDto = {
        message: 'Config retrieved successfully',
        success: true,
        status: 200,
        data: mock,
      };

      service.getConfig.mockResolvedValue(mockResponse);

      const result = await controller.getClaimConfig();

      expect(service.getConfig).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateClaimConfig', () => {
    it('should call service.updateConfig with the provided body', async () => {
      const requestMock = structuredClone(mock);
      requestMock[0].configs.configOne.defaultValue = 'updatedValue';
      requestMock[0].configs.configOne.type = 'select';
      const dto: ClaimConfigUpdateRequestDto = {
        request: mock,
        userId: '4',
      };

      const mockResponse: ClaimConfigResponseDto = {
        message: 'Config updated successfully',
        success: true,
        status: 200,
        data: requestMock,
      };

      service.updateConfig.mockResolvedValue(mockResponse);

      const result = await controller.updateClaimConfig(dto);

      expect(service.updateConfig).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });
});
