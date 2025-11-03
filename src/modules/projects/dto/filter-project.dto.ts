import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterProjectDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID de cliente',
    example: 'uuid-del-cliente'
  })
  @IsString({ message: 'ID de cliente debe ser texto' })
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado del proyecto',
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE
  })
  @IsEnum(ProjectStatus, { message: 'Estado de proyecto inválido' })
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ 
    description: 'Filtrar por cantidad mínima de trabajadores',
    example: 10
  })
  @IsNumber({}, { message: 'Cantidad de trabajadores debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  workersMin?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por cantidad máxima de trabajadores',
    example: 20
  })
  @IsNumber({}, { message: 'Cantidad de trabajadores debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  workersMax?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha de inicio desde',
    example: '2025-01-01'
  })
  @IsDateString({}, { message: 'Fecha debe ser válida' })
  @IsOptional()
  dateInitFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha de inicio hasta',
    example: '2025-12-31'
  })
  @IsDateString({}, { message: 'Fecha debe ser válida' })
  @IsOptional()
  dateInitTo?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por monto mínimo',
    example: 100000
  })
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  amountMin?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por monto máximo',
    example: 500000
  })
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  amountMax?: number;
}

