import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('Prisma');

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Solo log de queries que NO sean SELECT (ocultar SELECT)
    (this as any).$on('query', (e: any) => {
      const query = e.query as string;
      
      // Solo mostrar queries que NO sean SELECT
      if (!query.trim().toUpperCase().startsWith('SELECT')) {
        this.logger.log(`📝 ${query.substring(0, 100)}${query.length > 100 ? '...' : ''} (${e.duration}ms)`);
      }
    });

    // Siempre log de errores
    (this as any).$on('error', (e: any) => {
      this.logger.error(`❌ Database Error: ${e.message}`);
    });

    // Log de warnings
    (this as any).$on('warn', (e: any) => {
      this.logger.warn(`⚠️  Database Warning: ${e.message}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Soft delete helper
  async softDelete(model: keyof PrismaClient, id: string) {
    const modelDelegate = this[model] as any;
    return modelDelegate.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
      },
    });
  }
}

