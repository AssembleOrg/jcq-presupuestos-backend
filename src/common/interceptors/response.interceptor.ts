import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the response already has a success property, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // If data has 'meta' property, it's a paginated response
        if (data && typeof data === 'object' && 'meta' in data) {
          return {
            success: true,
            ...data,
          };
        }

        // Standard success response
        return {
          success: true,
          data,
        };
      }),
    );
  }
}

