import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let error = 'Error Interno';
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || this.getSpanishError(status);
        code = this.getErrorCode(status);
        
        // Handle validation errors
        if (Array.isArray(message)) {
          // Mantener como array para mensajes múltiples
          message = message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      code: code || `ERROR_${status}`,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private getSpanishError(status: number): string {
    const errorMessages: Record<number, string> = {
      400: 'Solicitud Incorrecta',
      401: 'No Autorizado',
      403: 'Acceso Prohibido',
      404: 'No Encontrado',
      409: 'Conflicto',
      422: 'Error de Validación',
      429: 'Demasiadas Solicitudes',
      500: 'Error Interno del Servidor',
      502: 'Puerta de Enlace Incorrecta',
      503: 'Servicio No Disponible',
    };

    return errorMessages[status] || 'Error';
  }

  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };

    return errorCodes[status] || `ERROR_${status}`;
  }
}

