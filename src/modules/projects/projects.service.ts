import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto, ChangeProjectStatusDto, FilterProjectDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { plainToInstance } from 'class-transformer';
import { createPaginationMeta, PaginatedResponseDto } from '~/common/interfaces';
import { DateTime } from 'luxon';
import { ProjectStatus } from '@prisma/client';
import { DolarService } from '~/common/services/dolar.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private dolarService: DolarService,
  ) {}

  private buildWhereClause(filters: FilterProjectDto) {
    const where: any = { deletedAt: null };

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.workersMin !== undefined || filters.workersMax !== undefined) {
      where.workers = {};
      if (filters.workersMin !== undefined) {
        where.workers.gte = filters.workersMin;
      }
      if (filters.workersMax !== undefined) {
        where.workers.lte = filters.workersMax;
      }
    }

    if (filters.dateInitFrom !== undefined || filters.dateInitTo !== undefined) {
      where.dateInit = {};
      if (filters.dateInitFrom) {
        where.dateInit.gte = new Date(filters.dateInitFrom);
      }
      if (filters.dateInitTo) {
        where.dateInit.lte = new Date(filters.dateInitTo);
      }
    }

    if (filters.amountMin !== undefined || filters.amountMax !== undefined) {
      where.amount = {};
      if (filters.amountMin !== undefined) {
        where.amount.gte = filters.amountMin;
      }
      if (filters.amountMax !== undefined) {
        where.amount.lte = filters.amountMax;
      }
    }

    return where;
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
    // Validar que el cliente existe
    const client = await this.prisma.client.findFirst({
      where: { 
        id: createProjectDto.clientId,
        deletedAt: null 
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Validar fechas
    const dateInit = new Date(createProjectDto.dateInit);
    const dateEnd = new Date(createProjectDto.dateEnd);

    if (dateEnd <= dateInit) {
      throw new BadRequestException('La fecha de finalización debe ser posterior a la fecha de inicio');
    }

    // Calcular rest (restante) inicial
    const rest = createProjectDto.amount;

    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        dateInit,
        dateEnd,
        totalPaid: 0,
        rest,
      },
      include: {
        client: true,
      },
    });

    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }

  async findAll(filters: FilterProjectDto = {}): Promise<ProjectResponseDto[]> {
    const where = this.buildWhereClause(filters);

    const projects = await this.prisma.project.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });

    return plainToInstance(ProjectResponseDto, projects, { excludeExtraneousValues: true });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    filters: FilterProjectDto = {}
  ): Promise<PaginatedResponseDto<ProjectResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: { client: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    const data = plainToInstance(ProjectResponseDto, projects, { excludeExtraneousValues: true });
    const meta = createPaginationMeta(page, limit, total);

    return { data, meta };
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
      include: { client: true, paids: true },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Validar fechas si se están actualizando
    if (updateProjectDto.dateInit || updateProjectDto.dateEnd) {
      const dateInit = updateProjectDto.dateInit ? new Date(updateProjectDto.dateInit) : project.dateInit;
      const dateEnd = updateProjectDto.dateEnd ? new Date(updateProjectDto.dateEnd) : project.dateEnd;

      if (dateEnd <= dateInit) {
        throw new BadRequestException('La fecha de finalización debe ser posterior a la fecha de inicio');
      }
    }

    // Preparar datos de actualización
    const dataToUpdate: any = { ...updateProjectDto };
    
    if (updateProjectDto.dateInit) {
      dataToUpdate.dateInit = new Date(updateProjectDto.dateInit);
    }
    
    if (updateProjectDto.dateEnd) {
      dataToUpdate.dateEnd = new Date(updateProjectDto.dateEnd);
    }

    // Si se actualiza el monto, recalcular rest
    if (updateProjectDto.amount !== undefined) {
      dataToUpdate.rest = updateProjectDto.amount - project.totalPaid;
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: dataToUpdate,
      include: { client: true },
    });

    return plainToInstance(ProjectResponseDto, updatedProject, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<{ message: string }> {
    const project = await this.prisma.project.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Soft delete
    await this.prisma.project.update({
      where: { id },
      data: {
        deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
      },
    });

    return { message: 'Proyecto eliminado exitosamente' };
  }

  // Método auxiliar para recalcular totales cuando se agrega un pago
  async recalculateTotals(projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { paids: { where: { deletedAt: null } } },
    });

    if (!project) return;

    const totalPaid = project.paids.reduce((sum, paid) => sum + paid.amount, 0);
    const rest = project.amount - totalPaid;

    await this.prisma.project.update({
      where: { id: projectId },
      data: { totalPaid, rest },
    });
  }

  // Validar transición de estado
  private validateStatusTransition(currentStatus: ProjectStatus, newStatus: ProjectStatus): void {
    // Mapeo de transiciones válidas
    const validTransitions: Record<ProjectStatus, ProjectStatus[]> = {
      [ProjectStatus.BUDGET]: [ProjectStatus.ACTIVE],
      [ProjectStatus.ACTIVE]: [ProjectStatus.IN_PROCESS, ProjectStatus.DELETED],
      [ProjectStatus.IN_PROCESS]: [ProjectStatus.FINISHED, ProjectStatus.DELETED],
      [ProjectStatus.FINISHED]: [], // No puede cambiar
      [ProjectStatus.DELETED]: [ProjectStatus.ACTIVE], // Se puede restaurar
    };

    // Si ya está en el mismo estado, no hacer nada
    if (currentStatus === newStatus) {
      throw new BadRequestException('El proyecto ya se encuentra en ese estado');
    }

    // Validar si la transición es válida
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar de ${currentStatus} a ${newStatus}. Transiciones válidas desde ${currentStatus}: ${validTransitions[currentStatus].join(', ') || 'ninguna'}`
      );
    }
  }

  // Cambiar estado del proyecto
  async changeStatus(id: string, changeStatusDto: ChangeProjectStatusDto): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: { 
        id,
        deletedAt: null 
      },
      include: { client: true },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Validar transición de estado
    this.validateStatusTransition(project.status, changeStatusDto.status);

    const dataToUpdate: any = {
      status: changeStatusDto.status,
    };

    // Si se está activando el proyecto (desde BUDGET o DELETED), obtener precio del dólar
    if (
      changeStatusDto.status === ProjectStatus.ACTIVE && 
      (project.status === ProjectStatus.BUDGET || project.status === ProjectStatus.DELETED)
    ) {
      try {
        const dolarPrice = await this.dolarService.getDolarBluePrice();
        dataToUpdate.usdPrice = dolarPrice;
      } catch (error) {
        throw new BadRequestException(
          'No se pudo obtener el precio del dólar. Intente nuevamente en unos momentos.'
        );
      }
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: dataToUpdate,
      include: { client: true },
    });

    return plainToInstance(ProjectResponseDto, updatedProject, { excludeExtraneousValues: true });
  }
}

