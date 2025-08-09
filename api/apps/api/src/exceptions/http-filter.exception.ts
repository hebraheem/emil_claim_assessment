import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: unknown = null;

    // Handle RCP exceptions
    if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object' && error !== null && 'errors' in error) {
        details = (error as { errors?: unknown }).errors || error;
      }
      status = HttpStatus.BAD_REQUEST;
      message = exception.message || 'RPC error occurred';
    }
    // Handle HTTP exceptions
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as { message?: string; errors?: unknown };
        message = resObj.message ?? message;
        details = resObj.errors ?? null;
      }
    }
    // Handle non-HttpException structured errors (like validation)
    else if (typeof exception === 'object' && exception !== null) {
      message = (exception as { message?: string }).message ?? message;
      details = (exception as { errors?: unknown }).errors ?? null;
    }
    // Handle string exceptions (e.g., simple error messages)
    else if (typeof exception === 'string') {
      message = exception;
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details ? { errors: details } : {}),
      timestamp: new Date().toISOString(),
    });
  }
}
