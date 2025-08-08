import { Body, Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ClaimConfigResponseDto, ClaimConfigUpdateRequestDto } from 'proto';

@Controller('claims-config')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retrieves the claim configuration.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto containing the configuration data.
   */
  @Get()
  getConfig(): Promise<ClaimConfigResponseDto> {
    return this.appService.getConfig();
  }

  /**
   * Updates the claim configuration.
   * @param {ClaimConfigUpdateRequestDto} body - The request body containing the configuration data to update.
   * @returns {Promise<ClaimConfigResponseDto>} A promise that resolves to ClaimConfigResponseDto confirming the update.
   */
  @Put()
  updateConfig(
    @Body() body: ClaimConfigUpdateRequestDto,
  ): Promise<ClaimConfigResponseDto> {
    return this.appService.updateConfig(body);
  }
}
