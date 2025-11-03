import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ 
    description: 'Nombre completo del cliente',
    example: 'Constructora ABC S.A.'
  })
  @IsString({ message: 'Nombre completo debe ser texto' })
  @IsOptional()
  fullname?: string;

  @ApiPropertyOptional({ 
    description: 'Teléfono de contacto',
    example: '+54 11 1234-5678'
  })
  @IsString({ message: 'Teléfono debe ser texto' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'CUIT del cliente',
    example: '20123456789'
  })
  @IsString({ message: 'CUIT debe ser texto' })
  @IsOptional()
  cuit?: string;

  @ApiPropertyOptional({ 
    description: 'DNI del cliente',
    example: '12345678'
  })
  @IsString({ message: 'DNI debe ser texto' })
  @IsOptional()
  dni?: string;
}

