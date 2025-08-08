import { Controller, Get } from '@nestjs/common';
import { ClaimsService } from './claims.service';

@Controller()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  getHello(): string {
    return this.claimsService.getHello();
  }
}
