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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto, ChangeProjectStatusDto, FilterProjectDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { ProjectStatus } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { AuditInterceptor } from '~/common/interceptors';

@ApiTags('Proyectos')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'CREATE', entity: 'Project' })
  @ApiOperation({ 
    summary: 'Crear un nuevo proyecto',
    description: 'Crea un proyecto con ubicación (lat/lng) para Google Maps o Leaflet'
  })
  @ApiResponse({
    status: 201,
    description: 'Proyecto creado exitosamente',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Fecha de finalización debe ser posterior a la fecha de inicio',
  })
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener todos los proyectos (sin paginación)',
    description: 'Filtra por: clientId, status (exacto), workers (rango), dateInit (rango), amount (rango)'
  })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ name: 'status', required: false, enum: ProjectStatus, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'workersMin', required: false, type: Number, description: 'Trabajadores mínimos' })
  @ApiQuery({ name: 'workersMax', required: false, type: Number, description: 'Trabajadores máximos' })
  @ApiQuery({ name: 'dateInitFrom', required: false, type: String, description: 'Fecha inicio desde (ISO)' })
  @ApiQuery({ name: 'dateInitTo', required: false, type: String, description: 'Fecha inicio hasta (ISO)' })
  @ApiQuery({ name: 'amountMin', required: false, type: Number, description: 'Monto mínimo' })
  @ApiQuery({ name: 'amountMax', required: false, type: Number, description: 'Monto máximo' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de proyectos filtrados',
    type: [ProjectResponseDto],
  })
  async findAll(@Query() filters: FilterProjectDto): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(filters);
  }

  @Get('pagination')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener proyectos con paginación',
    description: 'Filtra por: clientId, status (exacto), workers (rango), dateInit (rango), amount (rango)'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ name: 'status', required: false, enum: ProjectStatus, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'workersMin', required: false, type: Number, description: 'Trabajadores mínimos' })
  @ApiQuery({ name: 'workersMax', required: false, type: Number, description: 'Trabajadores máximos' })
  @ApiQuery({ name: 'dateInitFrom', required: false, type: String, description: 'Fecha inicio desde (ISO)' })
  @ApiQuery({ name: 'dateInitTo', required: false, type: String, description: 'Fecha inicio hasta (ISO)' })
  @ApiQuery({ name: 'amountMin', required: false, type: Number, description: 'Monto mínimo' })
  @ApiQuery({ name: 'amountMax', required: false, type: Number, description: 'Monto máximo' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de proyectos filtrados',
  })
  async findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filters: FilterProjectDto
  ) {
    return this.projectsService.findAllPaginated(paginationQuery, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener un proyecto por ID (incluye pagos)' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto encontrado',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Proyecto no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'UPDATE', entity: 'Project' })
  @ApiOperation({ summary: 'Actualizar un proyecto' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto actualizado exitosamente',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Proyecto no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'DELETE', entity: 'Project' })
  @ApiOperation({ summary: 'Eliminar un proyecto (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Proyecto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Proyecto no encontrado',
  })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'UPDATE', entity: 'Project' })
  @ApiOperation({ 
    summary: 'Cambiar estado del proyecto',
    description: `
    Transiciones válidas:
    - BUDGET → ACTIVE (obtiene precio del dólar automáticamente)
    - ACTIVE → IN_PROCESS o DELETED
    - IN_PROCESS → FINISHED o DELETED
    - FINISHED → (sin cambios permitidos)
    - DELETED → ACTIVE (restaurar)
    
    No se puede saltar estados (ej: BUDGET → FINISHED sin pasar por ACTIVE)
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Estado cambiado exitosamente. Si se activó el proyecto, incluye el precio del dólar',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Transición de estado inválida o error al obtener precio del dólar',
  })
  @ApiResponse({
    status: 404,
    description: 'Proyecto no encontrado',
  })
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeProjectStatusDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.changeStatus(id, changeStatusDto);
  }
}

