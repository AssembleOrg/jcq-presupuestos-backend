import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterClientDto {
  @ApiPropertyOptional({ 
    description: 'Buscar por nombre completo (búsqueda parcial, case insensitive)',
    example: 'Constructora'
  })
  @IsString({ message: 'Nombre debe ser texto' })
  @IsOptional()
  fullname?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por teléfono (búsqueda parcial)',
    example: '11 1234'
  })
  @IsString({ message: 'Teléfono debe ser texto' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por CUIT (búsqueda parcial, case insensitive)',
    example: '2012345'
  })
  @IsString({ message: 'CUIT debe ser texto' })
  @IsOptional()
  cuit?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por DNI (búsqueda parcial, case insensitive)',
    example: '12345'
  })
  @IsString({ message: 'DNI debe ser texto' })
  @IsOptional()
  dni?: string;
}

