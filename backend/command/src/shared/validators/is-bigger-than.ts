// Full credit to:
// https://stackoverflow.com/questions/59980341/can-i-compare-number-variables-with-class-validator/67815042#67815042

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * @description Decorator used for value comparison
 */
export function IsBiggerThan(
  property: string,
  validationOptions?: ValidationOptions,
): (object: unknown, propertyName: string) => void {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // any to ensure that validator returns boolean and does not throw an error
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value > relatedValue
          );
        },
      },
    });
  };
}
