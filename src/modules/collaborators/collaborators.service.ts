import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '~/prisma';
import { CollaboratorResponseDTO,CollaboratorSelectDTO,CreateCollaboratorDTO,FilterCollaboratorDTO,UpdateCollaboratorDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { PaginationQueryDto } from '~/modules/users/dto';
import { createPaginationMeta, PaginatedResponseDto } from '~/common/interfaces';

@Injectable()
export class CollaboratorService {
    constructor(private readonly prisma: PrismaService){}

    private buildWhereClause(filters: FilterCollaboratorDTO){
        const where: any = { deletedAt: null };

      if (filters.lastName) {
        where.lastName = { contains: filters.lastName, mode: 'insensitive' };
      }
  
      if (filters.companyName) {
        where.companyName = { contains: filters.companyName, mode: 'insensitive' };
      }
  
      if (filters.cuit) {
        where.cuit = { contains: filters.cuit, mode: 'insensitive' };
      }
  
      if (filters.dni) {
        where.dni = { contains: filters.dni, mode: 'insensitive' };
      }
  
      return where;
    }

    async createCollaborator(createCollaboratorDTO: CreateCollaboratorDTO) {
        if (!createCollaboratorDTO.cuit && !createCollaboratorDTO.dni ) { //Tiene mas validaciones pero por ahora dejar esto . Consultar de igual manera ! 
              throw new BadRequestException('Debe proporcionar CUIT o DNI del colaborador');
            }
        const collaborator = await this.prisma.collaborator.create({
              data: createCollaboratorDTO
            });
        return plainToInstance(CollaboratorResponseDTO, collaborator, { excludeExtraneousValues: true });
      }

    async getAllCollaborators(filters: FilterCollaboratorDTO = {}): Promise<CollaboratorResponseDTO[]>{
        const where = this.buildWhereClause(filters);

        const collaborators = await this.prisma.collaborator.findMany({
            where,
            orderBy:{createdAt:'desc'},
        })

        return plainToInstance(CollaboratorResponseDTO, collaborators, { excludeExtraneousValues: true });
    }

    async findAllPaginated(paginationQuery: PaginationQueryDto,filters: FilterCollaboratorDTO = {}):Promise<PaginatedResponseDto<CollaboratorResponseDTO>> {
        const { page = 1, limit = 10 } = paginationQuery;
        const skip = (page - 1) * limit;
        const where = this.buildWhereClause(filters);

        const [collaborators, total] = await Promise.all([
            this.prisma.collaborator.findMany({
              where,
              skip,
              take: limit,
              orderBy: { createdAt: 'desc' },
            }),
            this.prisma.collaborator.count({ where }),
          ]);
      
        const data = plainToInstance(CollaboratorResponseDTO, collaborators, { excludeExtraneousValues: true });
        const meta = createPaginationMeta(page, limit, total);
      
          return { data, meta };
    }
    
    async updateCollaborator(id: string, changes: UpdateCollaboratorDto){
        const collaborator = await this.prisma.collaborator.findUnique({where:{id}})

        if(!collaborator){
            throw new NotFoundException(`Colaborador con ID ${id} no encontrado`)
        }

        const updatedCollaborator= await this.prisma.collaborator.update({
            where: {id},
            data:changes,
        })

        return plainToInstance(CollaboratorResponseDTO, updatedCollaborator, { excludeExtraneousValues: true });
    }

    async deleteCollaborator(id:string): Promise<{ message: string }>{  //SOFT DELETE
        const collaborator = await this.prisma.collaborator.findFirst({
        where:{id,deletedAt: null},
        });
        if(!collaborator){
            throw new NotFoundException('Colaborador no encontrado');
        }
        await this.prisma.collaborator.update({
            where: { id },
            data: {
            deletedAt: DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate(),
        },
        });
        return {message:'Colaborador eliminado exitosamente'};
    }

    async getCollaboratorByID(id:string) : Promise<CollaboratorResponseDTO>{
    const collaborator = await this.prisma.collaborator.findUnique({
        where: { id, deletedAt: null },
    });

    if (!collaborator) {
        throw new NotFoundException(`Colaborador con ID ${id} no encontrada`);
    }

    return plainToInstance(CollaboratorResponseDTO,collaborator,{ excludeExtraneousValues: true })
    }

    async getCollaboratorsForSelect(): Promise<CollaboratorSelectDTO[]> {     //Mostrar una lista simplificada a la hora de asignar colaboradores a un proyecto (no traer todos los datos)
    const collaborators = await this.prisma.collaborator.findMany({
        where: { deletedAt: null },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
        }
    });
    return collaborators.map(c => ({
        id: c.id,
        displayName: c.companyName || `${c.firstName} ${c.lastName}`.trim()
    }));
}
}

