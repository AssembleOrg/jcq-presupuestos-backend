import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterPaidDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID de proyecto',
    example: 'uuid-del-proyecto'
  })
  @IsString({ message: 'ID de proyecto debe ser texto' })
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por número secuencial (búsqueda parcial, case insensitive)',
    example: '001-00001'
  })
  @IsString({ message: 'Número debe ser texto' })
  @IsOptional()
  number?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por código de factura (búsqueda parcial)',
    example: 'FC-2025'
  })
  @IsString({ message: 'Código de factura debe ser texto' })
  @IsOptional()
  bill?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por monto mínimo',
    example: 10000
  })
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  amountMin?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por monto máximo',
    example: 100000
  })
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Type(() => Number)
  @IsOptional()
  amountMax?: number;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha desde',
    example: '2025-01-01'
  })
  @IsDateString({}, { message: 'Fecha debe ser válida' })
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha hasta',
    example: '2025-12-31'
  })
  @IsDateString({}, { message: 'Fecha debe ser válida' })
  @IsOptional()
  dateTo?: string;
}

