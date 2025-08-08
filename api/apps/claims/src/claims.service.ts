import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaimsService {
  getHello(): string {
    return 'Hello World!';
  }
}
