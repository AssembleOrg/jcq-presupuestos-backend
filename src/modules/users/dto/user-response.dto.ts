import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ description: 'ID del usuario' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'Rol del usuario', enum: UserRole })
  @Expose()
  role: UserRole;

  @ApiProperty({ description: 'Estado activo' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Fecha de eliminación', required: false })
  @Expose()
  deletedAt?: Date;
}

