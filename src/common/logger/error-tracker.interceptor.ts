import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class ErrorTrackerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ErrorTracker');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, ip, body, query, params } = request;
        const user = (request as any).user;

        const errorInfo = {
          timestamp: new Date().toISOString(),
          method,
          url,
          ip,
          statusCode: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          user: user ? { id: user.id, email: user.email, role: user.role } : 'Anónimo',
          body: this.sanitizeData(body),
          query,
          params,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        };

        // Log según severidad
        if (errorInfo.statusCode >= 500) {
          this.logger.error(`🔴 Error Interno del Servidor:\n${JSON.stringify(errorInfo, null, 2)}`);
        } else if (errorInfo.statusCode >= 400) {
          this.logger.warn(`🟡 Error del Cliente:\n${JSON.stringify(errorInfo, null, 2)}`);
        }

        return throwError(() => error);
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'apiKey'];
    
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }
}

