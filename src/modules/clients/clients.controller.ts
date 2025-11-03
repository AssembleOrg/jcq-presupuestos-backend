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
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, ClientResponseDto, FilterClientDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { AuditInterceptor } from '~/common/interceptors';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'CREATE', entity: 'Client' })
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Debe proporcionar CUIT o DNI',
  })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener todos los clientes (sin paginación)',
    description: 'Filtra por: fullname, phone, cuit, dni (todas búsquedas parciales, case insensitive)'
  })
  @ApiQuery({ name: 'fullname', required: false, type: String, description: 'Buscar por nombre (parcial)' })
  @ApiQuery({ name: 'phone', required: false, type: String, description: 'Buscar por teléfono (parcial)' })
  @ApiQuery({ name: 'cuit', required: false, type: String, description: 'Buscar por CUIT (parcial)' })
  @ApiQuery({ name: 'dni', required: false, type: String, description: 'Buscar por DNI (parcial)' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de clientes filtrados',
    type: [ClientResponseDto],
  })
  async findAll(@Query() filters: FilterClientDto): Promise<ClientResponseDto[]> {
    return this.clientsService.findAll(filters);
  }

  @Get('pagination')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener clientes con paginación',
    description: 'Filtra por: fullname, phone, cuit, dni (todas búsquedas parciales, case insensitive)'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
  @ApiQuery({ name: 'fullname', required: false, type: String, description: 'Buscar por nombre (parcial)' })
  @ApiQuery({ name: 'phone', required: false, type: String, description: 'Buscar por teléfono (parcial)' })
  @ApiQuery({ name: 'cuit', required: false, type: String, description: 'Buscar por CUIT (parcial)' })
  @ApiQuery({ name: 'dni', required: false, type: String, description: 'Buscar por DNI (parcial)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de clientes filtrados',
  })
  async findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filters: FilterClientDto
  ) {
    return this.clientsService.findAllPaginated(paginationQuery, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ClientResponseDto> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'UPDATE', entity: 'Client' })
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'DELETE', entity: 'Client' })
  @ApiOperation({ summary: 'Eliminar un cliente (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  async remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}

