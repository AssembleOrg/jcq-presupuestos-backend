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
import { PaidsService } from './paids.service';
import { CreatePaidDto, UpdatePaidDto, PaidResponseDto, FilterPaidDto } from './dto';
import { PaginationQueryDto } from '~/modules/users/dto';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { AuditInterceptor } from '~/common/interceptors';

@ApiTags('Pagos')
@ApiBearerAuth()
@Controller('paids')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class PaidsController {
  constructor(private readonly paidsService: PaidsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'CREATE', entity: 'Paid' })
  @ApiOperation({ 
    summary: 'Registrar un nuevo pago',
    description: 'Registra un pago y actualiza automáticamente los totales del proyecto'
  })
  @ApiResponse({
    status: 201,
    description: 'Pago registrado exitosamente',
    type: PaidResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Proyecto no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'El monto del pago excede el restante del proyecto',
  })
  async create(@Body() createPaidDto: CreatePaidDto): Promise<PaidResponseDto> {
    return this.paidsService.create(createPaidDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener todos los pagos (sin paginación)',
    description: 'Filtra por: projectId (exacto), bill (parcial), amount (rango), date (rango)'
  })
  @ApiQuery({ name: 'projectId', required: false, type: String, description: 'Filtrar por ID de proyecto' })
  @ApiQuery({ name: 'bill', required: false, type: String, description: 'Buscar por código de factura' })
  @ApiQuery({ name: 'amountMin', required: false, type: Number, description: 'Monto mínimo' })
  @ApiQuery({ name: 'amountMax', required: false, type: Number, description: 'Monto máximo' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Fecha hasta (ISO)' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de pagos filtrados',
    type: [PaidResponseDto],
  })
  async findAll(@Query() filters: FilterPaidDto): Promise<PaidResponseDto[]> {
    return this.paidsService.findAll(filters);
  }

  @Get('pagination')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener pagos con paginación',
    description: 'Filtra por: projectId (exacto), bill (parcial), amount (rango), date (rango)'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
  @ApiQuery({ name: 'projectId', required: false, type: String, description: 'Filtrar por ID de proyecto' })
  @ApiQuery({ name: 'bill', required: false, type: String, description: 'Buscar por código de factura' })
  @ApiQuery({ name: 'amountMin', required: false, type: Number, description: 'Monto mínimo' })
  @ApiQuery({ name: 'amountMax', required: false, type: Number, description: 'Monto máximo' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String, description: 'Fecha desde (ISO)' })
  @ApiQuery({ name: 'dateTo', required: false, type: String, description: 'Fecha hasta (ISO)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de pagos filtrados',
  })
  async findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filters: FilterPaidDto
  ) {
    return this.paidsService.findAllPaginated(paginationQuery, filters);
  }

  @Get('project/:projectId')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener todos los pagos de un proyecto específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos del proyecto',
    type: [PaidResponseDto],
  })
  async findByProject(@Param('projectId') projectId: string): Promise<PaidResponseDto[]> {
    return this.paidsService.findByProject(projectId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago encontrado',
    type: PaidResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PaidResponseDto> {
    return this.paidsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'UPDATE', entity: 'Paid' })
  @ApiOperation({ 
    summary: 'Actualizar un pago',
    description: 'Actualiza un pago y recalcula automáticamente los totales del proyecto'
  })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado exitosamente',
    type: PaidResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePaidDto: UpdatePaidDto,
  ): Promise<PaidResponseDto> {
    return this.paidsService.update(id, updatePaidDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'DELETE', entity: 'Paid' })
  @ApiOperation({ 
    summary: 'Eliminar un pago (soft delete)',
    description: 'Elimina un pago y actualiza automáticamente los totales del proyecto'
  })
  @ApiResponse({
    status: 200,
    description: 'Pago eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  async remove(@Param('id') id: string) {
    return this.paidsService.remove(id);
  }
}

