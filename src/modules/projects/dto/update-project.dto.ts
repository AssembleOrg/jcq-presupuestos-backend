import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {
  @ApiPropertyOptional({ 
    description: 'Monto total del proyecto',
    example: 500000.50
  })
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Min(0, { message: 'Monto debe ser mayor o igual a 0' })
  @IsOptional()
  @Type(() => Number)
  amount?: number;

  @ApiPropertyOptional({ 
    description: 'Dirección del proyecto',
    example: 'Av. Corrientes 1234, Buenos Aires'
  })
  @IsString({ message: 'Dirección debe ser texto' })
  @IsOptional()
  locationAddress?: string;

  @ApiPropertyOptional({ 
    description: 'Latitud de la ubicación',
    example: -34.603722
  })
  @IsNumber({}, { message: 'Latitud debe ser un número' })
  @IsOptional()
  @Type(() => Number)
  locationLat?: number;

  @ApiPropertyOptional({ 
    description: 'Longitud de la ubicación',
    example: -58.381592
  })
  @IsNumber({}, { message: 'Longitud debe ser un número' })
  @IsOptional()
  @Type(() => Number)
  locationLng?: number;

  @ApiPropertyOptional({ 
    description: 'Cantidad de trabajadores necesarios',
    example: 15
  })
  @IsInt({ message: 'Cantidad de trabajadores debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 trabajador' })
  @IsOptional()
  @Type(() => Number)
  workers?: number;

  @ApiPropertyOptional({ 
    description: 'Fecha de inicio del proyecto',
    example: '2025-01-15T10:00:00Z'
  })
  @IsDateString({}, { message: 'Fecha de inicio debe ser una fecha válida' })
  @IsOptional()
  dateInit?: string;

  @ApiPropertyOptional({ 
    description: 'Fecha de finalización del proyecto',
    example: '2025-03-15T10:00:00Z'
  })
  @IsDateString({}, { message: 'Fecha de finalización debe ser una fecha válida' })
  @IsOptional()
  dateEnd?: string;
}

