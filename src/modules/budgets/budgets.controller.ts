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
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto,FilterBudgetDto,BudgetResponseDto,UpdateBudgetDto} from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '~/modules/users/dto';

@ApiTags('Presupuestos')
@ApiBearerAuth()
@Controller('budgets')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class BudgetsController{
    constructor (private readonly budgetsService: BudgetsService) {}

    @Post()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @Auditory({ action: 'CREATE', entity: 'Budget' })
    @ApiOperation({ summary: 'Crear presupuesto' })
    @ApiResponse({
            status: 201,
            description: 'Presupuesto creado exitosamente',
            type: BudgetResponseDto,
        })
    @ApiResponse({
        status: 400,
        description: 'Error en los datos proporcionados',
    })
    createBudget(@Body() createBudgetDto: CreateBudgetDto) : Promise<BudgetResponseDto> {
    return this.budgetsService.createBudget(createBudgetDto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ 
    summary: 'Obtener todos los presupuestos (sin paginación)',
    description: 'Filtra por: cliente y rango de fechas (todas búsquedas parciales, case insensitive)'
    })
    @ApiResponse({
            status: 200,
            description: 'Lista completa de presupuestos filtrados',
            type: [BudgetResponseDto],
        })
    async findAll(@Query() filters: FilterBudgetDto): Promise<BudgetResponseDto[]> {
        return this.budgetsService.findAllBudgets(filters);
        }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener presupuesto por ID'})
    @ApiResponse({
        status: 200,
        type: BudgetResponseDto,
    })
    async findOne(@Param('id') id: string) {
    return this.budgetsService.findOneBudget(id);
    }

    @Patch(':id') 
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Auditory({ action: 'UPDATE', entity: 'Budget' })
    @ApiOperation({ summary: 'Actualizar datos de un presupuesto' })
    updateBudget(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto ) : Promise<BudgetResponseDto> {
    return this.budgetsService.updateBudget(id, updateBudgetDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @Auditory({ action: 'DELETE', entity: 'Budget' })
    @ApiOperation({ summary: 'Eliminar un presupuesto (soft delete)' })
    @ApiResponse({
        status: 200,
        description: 'Presupuesto eliminado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Presupuesto no encontrado',
    })
    async removeBudget(@Param('id') id: string) {
        return this.budgetsService.removeBudget(id);
    }
}
