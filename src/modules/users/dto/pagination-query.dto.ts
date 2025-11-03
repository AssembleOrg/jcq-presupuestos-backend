import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ 
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt({ message: 'Página debe ser un número entero' })
  @Min(1, { message: 'Página debe ser mayor o igual a 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Límite de registros por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @Type(() => Number)
  @IsInt({ message: 'Límite debe ser un número entero' })
  @Min(1, { message: 'Límite debe ser mayor o igual a 1' })
  @Max(100, { message: 'Límite debe ser menor o igual a 100' })
  @IsOptional()
  limit?: number = 10;
}

