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
import { CashControlService } from './cashControl.service';
import { CreateExpenseDTO,
UpdateExpenseDto,
ExpenseResponseDTO,
FilterExpenseDTO,
CreateExpenseCategoryDTO,
ExpenseCategoryResponseDTO,
FilterExpenseCategoryDTO,
UpdateExpenseCategoryDto} from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '~/common/guards';
import { AuditInterceptor } from '~/common/interceptors';
import { Roles, Auditory } from '~/common/decorators';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '~/modules/users/dto';

@ApiTags('Control de Caja')
@ApiBearerAuth()
@Controller('cashControl')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class cashControlController{
    constructor (private readonly cashControlService: CashControlService){}

    @Post('expenses') 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @Auditory({ action: 'CREATE', entity: 'Expense' })
    @ApiOperation({ summary: 'Crear Gasto' })
    @ApiResponse({ status: 201, type: ExpenseResponseDTO })
    createExpense(@Body() createExpenseDto: CreateExpenseDTO): Promise<ExpenseResponseDTO> {
        return this.cashControlService.createExpense(createExpenseDto);
    }

    @Get('expenses')
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener todos los gastos (sin paginación)' })
    @ApiResponse({ status: 200, type: [ExpenseResponseDTO] })
    async findAllExpenses(@Query() filters: FilterExpenseDTO): Promise<ExpenseResponseDTO[]> {
        return this.cashControlService.getAllExpenses(filters);
    }

    @Get('expenses/pagination') 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener gastos con paginación' })
    @ApiResponse({ status: 200, description: 'Lista paginada' })
    async findAllPaginated(
        @Query() paginationQuery: PaginationQueryDto,
        @Query() filters: FilterExpenseDTO
      ) {
        return this.cashControlService.findAllExpensesPaginated(paginationQuery, filters);
    }

    @Patch('expenses/:id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Auditory({ action: 'UPDATE', entity: 'Expense' }) 
    @ApiOperation({ summary: 'Actualizar un gasto' })
    updateExpense(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto ): Promise<ExpenseResponseDTO> {
        return this.cashControlService.updateExpense(id, updateExpenseDto);
    }

    @Delete('expenses/:id') 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @Auditory({ action: 'DELETE', entity: 'Expense'})
    @ApiOperation({ summary: 'Eliminar un gasto (soft delete)' })
    async removeExpense(@Param('id') id: string) {
        return this.cashControlService.removeExpense(id);
    }

    //Categorias de gastos ↓↓↓

    @Post('categories') 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @Auditory({ action: 'CREATE', entity: 'ExpenseCategory' })
    @ApiOperation({ summary: 'Crear categoria de gasto' })
    @ApiResponse({ status: 201, type: ExpenseCategoryResponseDTO })
    createExpenseCategory(@Body() createExpenseCategoryDto: CreateExpenseCategoryDTO): Promise<ExpenseCategoryResponseDTO> {
        return this.cashControlService.createExpenseCategory(createExpenseCategoryDto);
    }

    @Get('categories') // 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Obtener todas las categorias de gastos' })
    @ApiResponse({ status: 200, type: [ExpenseCategoryResponseDTO] })
    async findAllCategoryExpenses(@Query() filters: FilterExpenseCategoryDTO): Promise<ExpenseCategoryResponseDTO[]> {
        return this.cashControlService.getAllCategoryExpenses(filters);
    }

    @Patch('categories/:id') 
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Auditory({ action: 'UPDATE', entity: 'ExpenseCategory' })
    @ApiOperation({ summary: 'Actualizar categoria de gasto' })
    updateExpenseCategory(@Param('id') id: string, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto ): Promise<ExpenseCategoryResponseDTO> {
        return this.cashControlService.updateCategoryExpense(id, updateExpenseCategoryDto);
    }

    @Delete('categories/:id') 
    @Roles(UserRole.ADMIN, UserRole.SUBADMIN)
    @Auditory({ action: 'DELETE', entity: 'ExpenseCategory'})
    @ApiOperation({ summary: 'Eliminar una categoria de gasto' })
    async removeExpenseCategory(@Param('id') id: string) {
        return this.cashControlService.removeExpenseCategory(id);
    }

}