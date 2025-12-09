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
import { StaffService } from './staff.service';
import { CreateStaffDto, StaffResponseDto, CreateWorkRecordDto, UpdateWorkRecordDto, FilterStaffDto, WorkRecordResponseDto, UpdateStaffDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';

@ApiTags('Staff')
@ApiBearerAuth()
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'CREATE', entity: 'Staff' })
  @ApiOperation({ summary: 'Crear empleado' })
  @ApiResponse({
      status: 201,
      description: 'Empleado creado exitosamente',
      type: StaffResponseDto,
    })
    @ApiResponse({
    status: 400,
    description: 'Debe proporcionar CUIT o DNI',
  })
  createStaff(@Body() createStaffDto: CreateStaffDto) : Promise<StaffResponseDto> {
    return this.staffService.createStaff(createStaffDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener todos los trabajadores (sin paginación)',
    description: 'Filtra por: nombre, apellido, cuit, dni (todas búsquedas parciales, case insensitive)'
  })
  @ApiQuery({ name: 'firstName', required: false, type: String, description: 'Buscar por nombre (parcial)' })
  @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Buscar por apellido (parcial)' })
  @ApiQuery({ name: 'cuit', required: false, type: String, description: 'Buscar por CUIT (parcial)' })
  @ApiQuery({ name: 'dni', required: false, type: String, description: 'Buscar por DNI (parcial)' })
  @ApiResponse({
      status: 200,
      description: 'Lista completa de empleados filtrados',
      type: [StaffResponseDto],
    })
  async findAll(@Query() filters: FilterStaffDto): Promise<StaffResponseDto[]> {
  return this.staffService.getAllStaff(filters);
  }

  @Post('work-record')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @Auditory({ action: 'CREATE', entity: 'Work-Record' })
  @ApiOperation({ summary: 'Crear un registro de horas' })
  @ApiResponse({
      status: 201,
      description: 'Cliente creado exitosamente',
      type: WorkRecordResponseDto,
    })
  async createWorkRecord(@Body() createWorkRecordDto: CreateWorkRecordDto): Promise<WorkRecordResponseDto> {
  return this.staffService.createWorkRecord(createWorkRecordDto);
  }

  @Patch('work-record/:id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Corregir planilla (Recalcula el total)' })
  updateWorkRecord(
    @Param('id') id: string, 
    @Body() updateDto: UpdateWorkRecordDto
  ) {
    return this.staffService.updateWorkRecord(id, updateDto);
  }

  @Get(':staffId/work-records')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener historial de pagos (Para el PDF)' })
  getStaffRecords(@Param('staffId') staffId: string) {
    return this.staffService.getWorkRecordsByStaff(staffId);
  }

  @Patch(':id') // La Ruta seria: /api/staff/uuid-del-empleado
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Auditory({ action: 'UPDATE', entity: 'Staff' })
  @ApiOperation({ summary: 'Actualizar datos del empleado' })
  updateStaff(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto ) {
  return this.staffService.updateStaff(id, updateStaffDto);
  }
}