import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, ValidateIf } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ 
    description: 'Nombre completo del cliente (empresa o persona)',
    example: 'Constructora ABC S.A.'
  })
  @IsString({ message: 'Nombre completo debe ser texto' })
  @IsNotEmpty({ message: 'Nombre completo es requerido' })
  fullname: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto',
    example: '+54 11 1234-5678'
  })
  @IsString({ message: 'Teléfono debe ser texto' })
  @IsNotEmpty({ message: 'Teléfono es requerido' })
  phone: string;

  @ApiPropertyOptional({ 
    description: 'CUIT del cliente (solo números o string, sin formato)',
    example: '20123456789'
  })
  @IsString({ message: 'CUIT debe ser texto' })
  @ValidateIf((o) => !o.dni)
  @IsNotEmpty({ message: 'Debe proporcionar CUIT o DNI' })
  @IsOptional()
  cuit?: string;

  @ApiPropertyOptional({ 
    description: 'DNI del cliente (solo números o string)',
    example: '12345678'
  })
  @IsString({ message: 'DNI debe ser texto' })
  @ValidateIf((o) => !o.cuit)
  @IsNotEmpty({ message: 'Debe proporcionar CUIT o DNI' })
  @IsOptional()
  dni?: string;
}

