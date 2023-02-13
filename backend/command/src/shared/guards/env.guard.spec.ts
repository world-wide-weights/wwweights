import { NotFoundException } from '@nestjs/common';
import { ENVGuard } from './env.guard';

describe('ENV guard', () => {
  let guard: ENVGuard;

  beforeAll(() => {
    guard = new ENVGuard();
  });

  describe('Positive Tests', () => {
    it('Should pass when NODE_ENV is development', () => {
      // ARRANGE
      process.env.NODE_ENV = 'development';
      // ACT
      // This does not need an execution context
      const res = guard.canActivate();
      // ASSERT
      expect(res).toBe(true);
    });
  });

  describe('Negative Tests', () => {
    it('Should fail when NODE_ENV is production', () => {
      // ARRANGE
      process.env.NODE_ENV = 'production';
      // ACT & ASSERT
      // This does not need an execution context
      expect(() => guard.canActivate()).toThrow(NotFoundException);
    });
    it('Should fail when NODE_ENV is kobi', () => {
      // ARRANGE
      process.env.NODE_ENV = 'kobi';
      // ACT & ASSERT
      // This does not need an execution context
      expect(() => guard.canActivate()).toThrow(NotFoundException);
    });
  });
});
