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
import { StructuresService } from './structures.service';
import { CreateStructureDto, FilterStructureDto, StructureResponseDto, UpdateStructureDto, } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '~/modules/users/dto';


@ApiTags('Estructuras')
@ApiBearerAuth()
@Controller('structures')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class StructuresController {
    constructor(private readonly structuresService: StructuresService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @Auditory({ action: 'CREATE', entity: 'Structure' })
    @ApiOperation({ summary: 'Crear estructura' })
    @ApiResponse({
        status: 201,
        description: 'Estructura creada exitosamente',
        type: StructureResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Error en los datos proporcionados',
    })
    createStructure(@Body() createStructureDto: CreateStructureDto): Promise<StructureResponseDto> {
        return this.structuresService.createStructure(createStructureDto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({
        summary: 'Obtener todas las estrucutras (sin paginación)',
        description: 'Filtra por: nombre y categoría (todas búsquedas parciales, case insensitive)'
    })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Buscar por nombre (parcial)' })
    @ApiQuery({ name: 'category', required: false, type: String, description: 'Buscar por categoria (parcial)' })
    @ApiResponse({
        status: 200,
        description: 'Lista completa de estructuras filtradas',
        type: [StructureResponseDto],
    })
    async findAll(@Query() filters: FilterStructureDto): Promise<StructureResponseDto[]> {
        return this.structuresService.getAllStructures(filters);
    }

    @Get('pagination')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({
        summary: 'Obtener estructuras con paginación',
        description: 'Filtra por: nombre y categoría (todas búsquedas parciales, case insensitive)'
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página', example: 10 })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Buscar por nombre (parcial)' })
    @ApiQuery({ name: 'category', required: false, type: String, description: 'Buscar por categoria (parcial)' })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de estructuras filtradas',
    })
    async findAllPaginated(
        @Query() paginationQuery: PaginationQueryDto,
        @Query() filters: FilterStructureDto
    ) {
        return this.structuresService.findAllPaginated(paginationQuery, filters);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener detalle de una estructura (incluye proyectos asignados)' })
    @ApiResponse({
        status: 200,
        type: StructureResponseDto,
    })
    async findOne(@Param('id') id: string) {
        return this.structuresService.getStructureById(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Auditory({ action: 'UPDATE', entity: 'Structure' })
    @ApiOperation({ summary: 'Actualizar datos de la estructura' })
    updateStructure(@Param('id') id: string, @Body() updateStructureDto: UpdateStructureDto) {
        return this.structuresService.updateStructure(id, updateStructureDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @Auditory({ action: 'DELETE', entity: 'Structure' })
    @ApiOperation({ summary: 'Eliminar una estructura (soft delete)' })
    @ApiResponse({
        status: 200,
        description: 'Estructura eliminada exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Estructura no encontrada',
    })
    async removeStructure(@Param('id') id: string) {
        return this.structuresService.deleteStructure(id);
    }

    @Get(':id/usage')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @ApiOperation({
        summary: 'Obtener los proyectos que usan una estructura específica'
    })
    async findUsage(@Param('id') id: string) {
        return this.structuresService.findUsage(id);
    }
}