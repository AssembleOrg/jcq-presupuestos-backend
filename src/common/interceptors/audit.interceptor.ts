import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '~/prisma';
import { AUDITORY_KEY, AuditoryOptions } from '~/common/decorators';
import { getRealIp, getUserAgent, LocationService } from '~/common/utils';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private locationService: LocationService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const auditoryOptions = this.reflector.get<AuditoryOptions>(
      AUDITORY_KEY,
      context.getHandler(),
    );

    if (!auditoryOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = getRealIp(request);
    const userAgent = getUserAgent(request);

    return next.handle().pipe(
      tap(async (data) => {
        try {
          // Get location from IP
          const location = await this.locationService.getLocationFromIp(ip);

          // Determine entity ID from response
          let entityId = 'unknown';
          if (data && typeof data === 'object') {
            if (data.data && data.data.id) {
              entityId = data.data.id;
            } else if (data.id) {
              entityId = data.id;
            }
          }

          // Save audit log
          await this.prisma.auditLog.create({
            data: {
              userId: user?.id || null,
              action: auditoryOptions.action,
              entity: auditoryOptions.entity,
              entityId,
              changes: data || null,
              ip,
              location,
              userAgent,
            },
          });
        } catch (error) {
          console.error('Error al guardar log de auditoría:', error);
        }
      }),
    );
  }
}

