import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollaboratorService } from './collaborators.service';
import { CollaboratorResponseDTO,CollaboratorSelectDTO,CreateCollaboratorDTO,FilterCollaboratorDTO,UpdateCollaboratorDto} from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '~/modules/users/dto';

@ApiTags('Colaboradores')
@ApiBearerAuth()
@Controller('collaborators')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class CollaboratorController{
    constructor (private readonly collaboratorService:CollaboratorService){}

    @Post()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @Auditory({ action: 'CREATE', entity: 'Collaborator' })
    @ApiOperation({ summary: 'Crear colaborador' })
    @ApiResponse({
        status: 201,
        description: 'Colaborador creado exitosamente',
        type: CollaboratorResponseDTO,
    })
    @ApiResponse({
    status: 400,
    description: 'Error en los datos proporcionados',
    })
    createCollaborator(@Body() createCollaboratorDTO: CreateCollaboratorDTO) : Promise<CollaboratorResponseDTO> {
    return this.collaboratorService.createCollaborator(createCollaboratorDTO);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ 
        summary: 'Obtener todos los colaboradores (sin paginación)',
        description: 'Filtra por: Apellido, CUIT/DNI y Razon Social'
    })
    @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Buscar por apellido(parcial)' })
    @ApiQuery({ name: 'cuit', required: false, type: String, description: 'Buscar por cuit (parcial)' })
    @ApiQuery({ name: 'dni', required: false, type: String, description: 'Buscar por dni (parcial)' })
    @ApiQuery({ name: 'companyName', required: false, type: String, description: 'Buscar por razon social (parcial)' })
    @ApiResponse({
        status: 200,
        description: 'Lista completa de colaboradores filtradas',
        type: [CollaboratorResponseDTO],
    })
    async findAll(@Query() filters: FilterCollaboratorDTO): Promise<CollaboratorResponseDTO[]> {
    return this.collaboratorService.getAllCollaborators(filters);
    }

    @Get('pagination')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ 
        summary: 'Obtener colaboradores con paginación',
        description: 'Filtra por: apellido, cuit, dni,razon social (todas búsquedas parciales, case insensitive)'
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
    @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Buscar por apellido (parcial)' })
    @ApiQuery({ name: 'companyName', required: false, type: String, description: 'Buscar por razon social (parcial)' })
    @ApiQuery({ name: 'cuit', required: false, type: String, description: 'Buscar por CUIT (parcial)' })
    @ApiQuery({ name: 'dni', required: false, type: String, description: 'Buscar por DNI (parcial)' })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de colaboradores filtrados',
    })
    async findAllPaginated(
        @Query() paginationQuery: PaginationQueryDto,
        @Query() filters: FilterCollaboratorDTO
      ) {
    return this.collaboratorService.findAllPaginated(paginationQuery, filters);
    }

    @Get('collabSelector')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Listado simple de colaboradores para seleccion' })
    @ApiResponse({
        status: 200,
        type: CollaboratorSelectDTO,
    })
    async collaboratorSelect() {
        return this.collaboratorService.getCollaboratorsForSelect();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener detalle de un colaborador' })
    @ApiResponse({
        status: 200,
        type: CollaboratorResponseDTO,
    })
    async findOne(@Param('id') id: string) {
    return this.collaboratorService.getCollaboratorByID(id);
    }

    @Patch(':id') 
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Auditory({ action: 'UPDATE', entity: 'Collaborator' })
    @ApiOperation({ summary: 'Actualizar datos de un colaborador' })
    updateCollaborator(@Param('id') id: string, @Body() updateCollaboratorDto: UpdateCollaboratorDto ): Promise<CollaboratorResponseDTO> {
    return this.collaboratorService.updateCollaborator(id,updateCollaboratorDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @Auditory({ action: 'DELETE', entity: 'Collaborator'})
    @ApiOperation({ summary: 'Eliminar un colaborador (soft delete)' })
    @ApiResponse({
        status: 200,
        description: 'Colaborador eliminado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Colaborador no encontrado',
    })
    async removeCollaborator(@Param('id') id: string) {
        return this.collaboratorService.deleteCollaborator(id);
    }



}