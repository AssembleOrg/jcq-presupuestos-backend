import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto, ChangeProjectStatusDto, FilterProjectDto, DashboardResponseDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { plainToInstance } from 'class-transformer';
import { createPaginationMeta, PaginatedResponseDto } from '~/common/interfaces';
import { DateTime } from 'luxon';
import { ProjectStatus } from '@prisma/client';
import { DolarService } from '~/common/services/dolar.service';
import { CreateProjectItemDto, ProjectItemResponseDto } from '~/modules/structures/dto';

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
    const { structures, ...projectData } = createProjectDto;

    //Validar que el cliente existe
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

    const rest = createProjectDto.amount;

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ...projectData,
          dateInit,
          dateEnd,
          totalPaid: 0,
          rest,
        },
        include: {
          client: true,
        },
      });

      if (structures && structures.length > 0) {
        for (const item of structures) {
          const structure = await tx.structure.findUnique({ 
            where: { id: item.structureId } 
          });

          if (!structure) {
            throw new NotFoundException(`Estructura con ID ${item.structureId} no encontrada`);
          }

          if (structure.stock < item.quantity) {
            throw new BadRequestException(
              `Stock insuficiente para "${structure.name}". Solicitado: ${item.quantity}, Disponible: ${structure.stock}`
            );
          }

          await tx.structure.update({
            where: { id: item.structureId },
            data: { stock: { decrement: item.quantity } }
          });

          await tx.projectItem.create({
            data: {
              projectId: project.id,
              structureId: item.structureId,
              quantity: item.quantity
            }
          });
        }
      }

      return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
    });
  }

  async findAll(filters: FilterProjectDto = {}): Promise<ProjectResponseDto[]> {
    const where = this.buildWhereClause(filters);

    const projects = await this.prisma.project.findMany({
      where,
      include: { 
        client: true,
        items: {
          include: {
            structure: true // Necesitamos el nombre de la estructura
          }
        }
      },
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
        include: { 
          client: true,
          items: {
            include: {
              structure: true
            }
          }
        },
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
      include: { 
        client: true, 
        paids: true,
        items: {
          include: {
            structure: true // Para tener el nombre y la medida del item
          }
        }
      },
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return plainToInstance(ProjectResponseDto, project, { excludeExtraneousValues: true });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const { structures, ...projectData } = updateProjectDto;

    // Verificar existencia y obtener estado actual para calcular diferencias
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: { 
        items: true 
      } 
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Validación de fechas
    if (projectData.dateInit || projectData.dateEnd) {
      const dateInit = projectData.dateInit ? new Date(projectData.dateInit) : project.dateInit;
      const dateEnd = projectData.dateEnd ? new Date(projectData.dateEnd) : project.dateEnd;

      if (dateEnd <= dateInit) {
        throw new BadRequestException('La fecha de finalización debe ser posterior a la fecha de inicio');
      }
    }

    // Preparar datos simples
    const dataToUpdate: any = { ...projectData };
    if (projectData.dateInit) dataToUpdate.dateInit = new Date(projectData.dateInit);
    if (projectData.dateEnd) dataToUpdate.dateEnd = new Date(projectData.dateEnd);
    if (projectData.amount !== undefined) {
      dataToUpdate.rest = projectData.amount - project.totalPaid;
    }

    return this.prisma.$transaction(async (tx) => {
      
      if (structures) {
        const currentItemsMap = new Map(project.items.map(i => [i.structureId, i.quantity]));
        const incomingStructureIds = new Set(structures.map(s => s.structureId));

        for (const newItem of structures) {
          const currentQty = currentItemsMap.get(newItem.structureId) || 0;
          const difference = newItem.quantity - currentQty; 

          if (difference !== 0) {
            const structure = await tx.structure.findUnique({ where: { id: newItem.structureId } });
            
            if (!structure) throw new NotFoundException(`Estructura ${newItem.structureId} no encontrada`);

            if (difference > 0 && structure.stock < difference) {
              throw new BadRequestException(
                `Stock insuficiente para "${structure.name}". Necesitas ${difference} más, pero solo hay ${structure.stock}.`
              );
            }

            // Actualizar Stock
            await tx.structure.update({
              where: { id: newItem.structureId },
              data: { stock: { decrement: difference } }
            });

            // Actualizar/Crear Relacion
            await tx.projectItem.upsert({
              where: { projectId_structureId: { projectId: id, structureId: newItem.structureId } },
              update: { quantity: newItem.quantity },
              create: {
                projectId: id,
                structureId: newItem.structureId,
                quantity: newItem.quantity
              }
            });
          }
        }

        // Procesar eliminaciones 
        for (const [structureId, quantity] of currentItemsMap) {
          if (!incomingStructureIds.has(structureId)) {
            // Devolver stock
            await tx.structure.update({
              where: { id: structureId },
              data: { stock: { increment: quantity } }
            });

            // Borrar relación
            await tx.projectItem.delete({
              where: { projectId_structureId: { projectId: id, structureId } }
            });
          }
        }
      }

      const updatedProject = await tx.project.update({
        where: { id },
        data: dataToUpdate,
        include: { 
          client: true,
          items: {
            include: {
              structure: true
            }
          }
         }, 
      });

      return plainToInstance(ProjectResponseDto, updatedProject, { excludeExtraneousValues: true });
    });
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

  async getDashboard(): Promise<DashboardResponseDto> {
    // Obtener estadísticas en paralelo
    const [activeProjectsCount, totalClientsCount, projectsForStats, recentProjects] = await Promise.all([
      // Total de proyectos activos
      this.prisma.project.count({
        where: {
          status: ProjectStatus.ACTIVE,
          deletedAt: null,
        },
      }),
      
      // Total de clientes
      this.prisma.client.count({
        where: { deletedAt: null },
      }),
      
      // Proyectos para calcular totales (solo activos)
      this.prisma.project.findMany({
        where: {
          status: ProjectStatus.ACTIVE,
          deletedAt: null,
        },
        select: {
          totalPaid: true,
          rest: true,
        },
      }),
      
      // Últimos 5 proyectos recientes (ordenados por fecha de creación)
      this.prisma.project.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          totalPaid: true,
          locationAddress: true,
          client: {
            select: {
              fullname: true,
            },
          },
        },
      }),
    ]);

    // Calcular total cobrado y pendiente
    const totalCollected = projectsForStats.reduce((sum, project) => sum + project.totalPaid, 0);
    const totalPending = projectsForStats.reduce((sum, project) => sum + project.rest, 0);

    // Mapear proyectos recientes
    const recentProjectsFormatted = recentProjects.map(project => ({
      id: project.id,
      clientName: project.client.fullname,
      locationAddress: project.locationAddress || 'Sin dirección',
      amount: project.amount,
      totalPaid: project.totalPaid,
    }));

    return plainToInstance(
      DashboardResponseDto,
      {
        stats: {
          activeProjects: activeProjectsCount,
          totalClients: totalClientsCount,
          totalCollected,
          totalPending,
        },
        recentProjects: recentProjectsFormatted,
      },
      { excludeExtraneousValues: true },
    );
  }

  async addStructure(projectId: string, createDto: CreateProjectItemDto): Promise<ProjectItemResponseDto> {
  const { structureId, quantity } = createDto;

  return this.prisma.$transaction(async (tx) => {
    const structure = await tx.structure.findUnique({ where: { id: structureId } });
    if (!structure) throw new NotFoundException('Estructura no encontrada');

    const existingItem = await tx.projectItem.findUnique({
      where: { projectId_structureId: { projectId, structureId } },
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const stockNeeded = quantity - currentQty; 

    if (stockNeeded > 0 && structure.stock < stockNeeded) {
      throw new BadRequestException(
        `Stock insuficiente. Disponibles: ${structure.stock}, Necesarios extra: ${stockNeeded}`
      );
    }

    await tx.structure.update({
      where: { id: structureId },
      data: { stock: { decrement: stockNeeded } }, 
    });

    const item = await tx.projectItem.upsert({
      where: { projectId_structureId: { projectId, structureId } },
      update: { quantity: quantity }, 
      create: { projectId, structureId, quantity },
      include: { structure: true },
    });

    return {
      id: item.id,
      quantity: item.quantity,
      projectId: item.projectId,
      structureId: item.structureId,
      structureName: item.structure.measure 
      ? `${item.structure.name} (${item.structure.measure})` 
      : item.structure.name, 
    };
  });
}

  async findProjectItems(id: string): Promise<ProjectItemResponseDto[]> {
    const items = await this.prisma.projectItem.findMany({
      where: { projectId: id },
      include: { structure: true },
    })

    return items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      projectId: item.projectId,
      structureId: item.structureId,
      structureName: item.structure.measure 
      ? `${item.structure.name} (${item.structure.measure})` 
      : item.structure.name,
    }));
  }

  async updateProjectItem(projectId: string, structureId: string, newQuantity: number): Promise<ProjectItemResponseDto> {
  return this.prisma.$transaction(async (tx) => {
    const currentItem = await tx.projectItem.findUnique({
      where: { projectId_structureId: { projectId, structureId } },
      include: { structure: true } 
    });

    if (!currentItem) throw new NotFoundException('El ítem no existe en este proyecto');

    const difference = newQuantity - currentItem.quantity; 
    if (difference > 0 && currentItem.structure.stock < difference) {
      throw new BadRequestException(`Stock insuficiente. Solo hay ${currentItem.structure.stock} disponibles.`);
    }

    await tx.structure.update({
      where: { id: structureId },
      data: { stock: { decrement: difference } }, 
    });

    const updatedItem = await tx.projectItem.update({
      where: { projectId_structureId: { projectId, structureId } },
      data: { quantity: newQuantity },
      include: { structure: true },
    });

    return {
      id: updatedItem.id,
      quantity: updatedItem.quantity,
      projectId: updatedItem.projectId,
      structureId: updatedItem.structureId,
      structureName: updatedItem.structure.measure 
        ? `${updatedItem.structure.name} (${updatedItem.structure.measure})` 
        : updatedItem.structure.name,
    };
  });
}

  async removeProjectItem(projectId: string, structureId: string): Promise<{ message: string }> {
  return this.prisma.$transaction(async (tx) => {
    const item = await tx.projectItem.findUnique({
      where: { projectId_structureId: { projectId, structureId } },
    });

    if (!item) throw new NotFoundException('El ítem no existe');

    await tx.structure.update({
      where: { id: structureId },
      data: { stock: { increment: item.quantity } },
    });

    await tx.projectItem.delete({
      where: { projectId_structureId: { projectId, structureId } },
    });

    return { message: 'Ítem eliminado y stock restaurado correctamente' };
  });
}

async assignCollaborator(projectId: string, collaboratorId: string): Promise<ProjectResponseDto> {
  return await this.prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const collaborator = await tx.collaborator.findUnique({
      where: { id: collaboratorId, deletedAt: null },
    });
    if (!collaborator) throw new NotFoundException('Colaborador no encontrado');

    const displayName = collaborator.companyName 
      ? collaborator.companyName 
      : `${collaborator.firstName} ${collaborator.lastName}`.trim();

    const updatedProject = await tx.project.update({
      where: { id: projectId },
      data: {
        collaboratorId: collaborator.id,
        collabWorkersCount: collaborator.quantityWorkers, 
        collabValuePerHour: collaborator.valuePerHour,   
        collabDisplayName: displayName,                  
      },
      include: {
        client: true, 
        collaborator: true, 
      }
    });

    return plainToInstance(ProjectResponseDto, updatedProject, { excludeExtraneousValues: true });
  });
}


}
