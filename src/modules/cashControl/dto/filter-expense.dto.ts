import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterExpenseDTO{
    @ApiPropertyOptional({
        description:'Fecha inicio'
    })
    @IsDateString({}, { message: 'La fecha de inicio debe ser válida (ISO 8601)' })
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        description:'Fecha fin'
    })
    @IsDateString({}, { message: 'La fecha de fin debe ser válida (ISO 8601)' })
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({
        description:'Nombre de categoria asociada al gasto'
    })
    @IsString()
    @IsOptional()
    expenseCategoryName?: string;
}