import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty} from 'class-validator';

export class FilterStaffDto {
  @ApiPropertyOptional({ 
    description: 'Nombre del personal',
    example: 'Juan '
    })
  @IsOptional()
  @IsString({message: 'El nombre debe ser texto'})
  firstName?: string; 
    
  @ApiPropertyOptional({ 
    description: 'Apellido del personal',
    example: 'Martinez'
    })
  @IsOptional()
  @IsString({message: 'El nombre debe ser texto'})
  lastName?: string; 

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