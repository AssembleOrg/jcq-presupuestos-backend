import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStructureDto, StructureResponseDto, UpdateStructureDto, FilterStructureDto } from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class StructuresService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(filters: FilterStructureDto) {
      const where: any = { deletedAt: null };
      if (filters.name) {
        where.name = { contains: filters.name, mode: 'insensitive' };
      }
      if (filters.category) {
        where.category = { contains: filters.category, mode: 'insensitive' };
      }
      return where;
    }

  async createStructure(createStructureDto: CreateStructureDto) {
    if(!createStructureDto.category){
        throw new BadRequestException('La categoría es obligatoria');
    }
    const structure = await this.prisma.structure.create({
      data: createStructureDto 
    });
    return this.mapToResponse(structure, 0); 
  }

  async getAllStructures(filters: FilterStructureDto = {}): Promise<StructureResponseDto[]> {
      const where = this.buildWhereClause(filters);
      
      const structures = await this.prisma.structure.findMany({
          where,
          include: {
              items: {
                  where: {
                      project: {
                          status: { in: [ProjectStatus.ACTIVE, ProjectStatus.IN_PROCESS] }
                      }
                  },
                  select: { quantity: true }
              }
          },
          orderBy: { name: 'asc' },
      });

      return structures.map(structure => {
          const inUse = structure.items.reduce((acc, item) => acc + item.quantity, 0);
          return this.mapToResponse(structure, inUse);
      });
  }

  async getStructureById(id: string): Promise<StructureResponseDto> {
    const structure = await this.prisma.structure.findUnique({
        where: { id, deletedAt: null },
        include: {
            items: {
                where: {
                    project: {
                        status: { in: [ProjectStatus.ACTIVE, ProjectStatus.IN_PROCESS] }
                    }
                },
                select: { quantity: true } 
            }
        }
    });

    if (!structure) {
        throw new NotFoundException(`Estructura con ID ${id} no encontrada`);
    }

    const inUse = structure.items.reduce((acc, item) => acc + item.quantity, 0);
    return this.mapToResponse(structure, inUse);
  }

  async findUsage(id: string) {
    const usages = await this.prisma.projectItem.findMany({
      where: { 
        structureId: id,
        project: {
            status: { in: [ProjectStatus.ACTIVE, ProjectStatus.IN_PROCESS] }
        }
      },
      include: {
        project: {
          include: { client: true }
        }
      },
      orderBy: { project: { dateEnd: 'asc' } }
    });

    return usages.map(item => ({
      projectId: item.projectId,
      projectName: item.project.event || "Sin nombre de evento",
      clientName: item.project.client.fullname,
      status: item.project.status,
      quantity: item.quantity,
      dateEnd: item.project.dateEnd
    }));
  }

  async updateStructure(id: string, data: UpdateStructureDto): Promise<StructureResponseDto> {
      const existingStructure = await this.prisma.structure.findUnique({
          where: { id, deletedAt: null },
      });

      if (!existingStructure) {
          throw new NotFoundException(`Estructura con ID ${id} no encontrada`);
      }

      const updatedStructure = await this.prisma.structure.update({
          where: { id },
          data: data,
          include: {
              items: {
                  where: {
                      project: { status: { in: [ProjectStatus.ACTIVE, ProjectStatus.IN_PROCESS] } }
                  }
              }
          }
      });

      const inUse = updatedStructure.items ? updatedStructure.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
      return this.mapToResponse(updatedStructure, inUse);
  }

    async deleteStructure(id: string): Promise<{message: string}> {
        const structure = await this.prisma.structure.findUnique({
            where: { id, deletedAt: null},
        });
        if(!structure){
            throw new NotFoundException(`Estructura con ID ${id} no encontrada`);
        }
        await this.prisma.structure.update({
            where: { id },
              data: {
                deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
              },
            });
        return {message:'Estructura eliminada exitosamente'};
    }

    private mapToResponse(structure: any, inUse: number): StructureResponseDto {
      const response = plainToInstance(StructureResponseDto, structure, { excludeExtraneousValues: true });
      
      response.available = structure.stock; 
      response.inUse = inUse;               
      
      response.stock = structure.stock + inUse; 
      
      return response;
  }
}