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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, PaginationQueryDto, FilterUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { AuditInterceptor } from '~/common/interceptors';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'CREATE', entity: 'User' })
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios (sin paginación)',
    description: 'Filtra por: email, firstName, lastName (búsqueda parcial), role, isActive (exacto)'
  })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Buscar por email' })
  @ApiQuery({ name: 'firstName', required: false, type: String, description: 'Buscar por nombre' })
  @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Buscar por apellido' })
  @ApiQuery({ name: 'role', required: false, enum: ['ADMIN', 'SUBADMIN', 'MANAGER'], description: 'Filtrar por rol' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de usuarios filtrados',
    type: [UserResponseDto],
  })
  async findAll(@Query() filters: FilterUserDto): Promise<UserResponseDto[]> {
    return this.usersService.findAll(filters);
  }

  @Get('pagination')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ 
    summary: 'Obtener usuarios con paginación',
    description: 'Filtra por: email, firstName, lastName (búsqueda parcial), role, isActive (exacto)'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Buscar por email' })
  @ApiQuery({ name: 'firstName', required: false, type: String, description: 'Buscar por nombre' })
  @ApiQuery({ name: 'lastName', required: false, type: String, description: 'Buscar por apellido' })
  @ApiQuery({ name: 'role', required: false, enum: ['ADMIN', 'SUBADMIN', 'MANAGER'], description: 'Filtrar por rol' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuarios filtrados',
  })
  async findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filters: FilterUserDto
  ) {
    return this.usersService.findAllPaginated(paginationQuery, filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
  @Auditory({ action: 'UPDATE', entity: 'User' })
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @Auditory({ action: 'DELETE', entity: 'User' })
  @ApiOperation({ summary: 'Eliminar un usuario (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

