import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterBudgetDto {
  @ApiPropertyOptional({ description: 'Buscar por cliente asociado' })
  @IsString()
  @IsOptional()
  clientName?: string;

  @ApiPropertyOptional({ description: 'Buscar por nombre de cliente (ingreso manual)' })
  @IsString()
  @IsOptional()
  manualClientName?: string;

  @ApiPropertyOptional({ description: 'Fecha INICIO del rango de busqueda(ISO 8601)' })
  @IsDateString({}, { message: 'La fecha de inicio debe ser válida (ISO 8601)' }) 
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha FIN del rango de busqueda(ISO 8601)' }) 
  @IsDateString({}, { message: 'La fecha de fin debe ser válida (ISO 8601)' })
  @IsOptional()
  endDate?: string;
}
