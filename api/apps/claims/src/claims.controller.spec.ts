import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

describe('ClaimsController', () => {
  let claimsController: ClaimsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [ClaimsService],
    }).compile();

    claimsController = app.get<ClaimsController>(ClaimsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(claimsController.getHello()).toBe('Hello World!');
    });
  });
});
