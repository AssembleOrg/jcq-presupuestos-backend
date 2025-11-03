import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClientResponseDto {
  @ApiProperty({ description: 'ID del cliente' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre completo del cliente' })
  @Expose()
  fullname: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @Expose()
  phone: string;

  @ApiPropertyOptional({ description: 'CUIT del cliente' })
  @Expose()
  cuit?: string;

  @ApiPropertyOptional({ description: 'DNI del cliente' })
  @Expose()
  dni?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de eliminación' })
  @Expose()
  deletedAt?: Date;
}

