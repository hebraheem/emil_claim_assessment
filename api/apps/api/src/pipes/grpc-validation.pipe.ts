import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * gRPC Validation Pipe
 * This pipe validates incoming gRPC requests using class-validator.
 * It transforms the incoming data into an instance of the specified class
 * and checks for validation errors. If validation fails, it throws a RpcException
 * with a detailed error message.
 *
 * @reference https://docs.nestjs.com/pipes#class-validator
 * @codeSupport ChatGPT
 */
@Injectable()
export class GrpcValidationPipe implements PipeTransform<any> {
  constructor(private readonly dto?: unknown) {} // Optional DTO for validation

  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (typeof value !== 'object') {
      return value;
    }
    try {
      const metatype = this.dto || metadata.metatype;
      if (
        !metatype ||
        !this.toValidate(metatype as new (...args: any[]) => any)
      ) {
        return value;
      }

      const object = plainToInstance(
        metatype as new (...args: any[]) => any,
        value,
      ) as unknown;

      const errors = await validate(object as object, {});

      if (errors.length > 0) {
        const failedItems = this.flattenValidationErrors(errors);
        if (failedItems.length > 0) {
          throw new RpcException({
            code: 3, // gRPC INVALID_ARGUMENT
            message: 'Validation failed',
            errors: failedItems,
          });
        }
      }

      return object;
    } catch (error) {
      // Ensure even unexpected errors don't crash the app
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: 13, // INTERNAL
        message: 'Unexpected validation error',
      });
    }
  }

  /**
   * Recursively flattens validation errors and returns only those with constraints.
   */
  private flattenValidationErrors(
    errors: ValidationError[],
    parentPath = '',
  ): Array<{ property: string; constraints: any }> {
    let failed: Array<{ property: string; constraints: any }> = [];
    for (const err of errors) {
      const propertyPath = parentPath
        ? `${parentPath}.${err.property}`
        : err.property;
      if (err.constraints) {
        failed.push({
          property: propertyPath,
          constraints: err.constraints,
        });
      }
      if (err.children && err.children.length > 0) {
        failed = failed.concat(
          this.flattenValidationErrors(err.children, propertyPath),
        );
      }
    }
    return failed;
  }

  /**
   * Determines if the metatype is a class that needs validation.
   * Excludes primitive types and built-in types like String, Boolean, Number, Array, and Object.
   */
  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: Array<new (...args: any[]) => any> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
