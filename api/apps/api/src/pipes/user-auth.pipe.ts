import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

/**
 * User Authentication Pipe
 * This pipe checks for the presence of the x-userId header in the request.
 * If the header is missing, it throws a BadRequestException.
 *
 * @reference https://docs.nestjs.com/pipes#pipes
 */
@Injectable()
export class UserAuthPipe implements PipeTransform {
  transform(value: { metadata: unknown; headers?: unknown }) {
    if (typeof value !== 'object') {
      return value;
    }
    const userId = value['userId'] as string;
    if (!userId) {
      throw new BadRequestException('Unauthorized: userId header is missing');
    }
    return value;
  }
}
