import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    // For HTTP requests
    if (req && req.headers) {
      const userId = (req.headers['x-userid'] ||
        req.headers['x-userId']) as string;

      if (userId && req.body) {
        (req.body as Record<string, any>).userId = userId;
      }
    }

    return next.handle();
  }
}
