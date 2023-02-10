import { validate } from 'class-validator';
import { IsBiggerThan } from './is-bigger-than';
describe('IsBiggerThan', () => {
  describe('Postive tests', () => {
    it('should return no ValidationErrors when marked number is bigger than other', async () => {
      class Test {
        @IsBiggerThan('min')
        max: number;
        min: number;
      }

      const test = new Test();
      test.max = 10; // Max is bigger than min => All good!
      test.min = 5;

      const validationErrorsArray = await validate(test);
      expect(test.max).toBeGreaterThan(test.min); // Sanity check
      expect(validationErrorsArray).toEqual([]);
      expect(validationErrorsArray).toHaveLength(0);

      // Left number is bigge
      const allowedNumberPairs = [
        [10, 5],
        [10, 9],
        [10, 0],
        [0, -10],
        [0, -1],
        [0, -100],
        [-10, -20],
        [Number.MAX_VALUE, Number.MIN_VALUE],
        [Number.MAX_VALUE, Number.MIN_SAFE_INTEGER],
      ];

      for (const [max, min] of allowedNumberPairs) {
        test.max = max;
        test.min = min;
        const validationErrorsArray = await validate(test);
        expect(test.max).toBeGreaterThan(test.min); // Sanity check
        expect(validationErrorsArray).toEqual([]);
        expect(validationErrorsArray).toHaveLength(0);
      }
    });

    it('should contain error message when max is not bigger than min', async () => {
      const errorMessage = 'Max should be bigger than min';
      class Test {
        @IsBiggerThan('min', {
          message: errorMessage,
        })
        max: number;
        min: number;
      }

      const test = new Test();
      test.max = 5;
      test.min = 10;

      const validationErrorsArray = await validate(test);
      const validationError = validationErrorsArray[0];

      expect(test.max).toBeLessThan(test.min); // Sanity check
      expect(validationErrorsArray).toHaveLength(1);
      expect(validationError.constraints).toHaveProperty(
        'isBiggerThan',
        errorMessage,
      );
    });
  });
  describe('Negative tests', () => {
    it('should return ValidationError when number is equal to the other number', async () => {
      class Test {
        @IsBiggerThan('min')
        max: number;
        min: number;
      }

      const test = new Test();
      test.max = 5;
      test.min = 5;

      const validationErrorsArray = await validate(test);
      const validationError = validationErrorsArray[0];

      expect(test.max).toBe(test.min); // Sanity check
      expect(validationErrorsArray).toHaveLength(1);
      expect(validationError.constraints).toHaveProperty('isBiggerThan');
    });

    it('should return ValidationError when number is smaller than the other number', async () => {
      class Test {
        @IsBiggerThan('min')
        max: number;
        min: number;
      }

      const test = new Test();
      test.max = 5;
      test.min = 10;

      const validationErrorsArray = await validate(test);
      const validationError = validationErrorsArray[0];

      expect(test.max).toBeLessThan(test.min); // Sanity check
      expect(validationErrorsArray).toHaveLength(1);
      expect(validationError.constraints).toHaveProperty('isBiggerThan');
    });

    it('should return ValidationError when number is not a number', async () => {
      class Test {
        @IsBiggerThan('min')
        max: number;
        min: string;
      }

      const test = new Test();
      test.max = 10;
      test.min = 'Welcome';

      const validationErrorsArray = await validate(test);
      const validationError = validationErrorsArray[0];

      expect(validationErrorsArray).toHaveLength(1);
      expect(validationError.constraints).toHaveProperty('isBiggerThan');
    });
  });
});
