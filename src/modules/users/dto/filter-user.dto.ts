import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterUserDto {
  @ApiPropertyOptional({ 
    description: 'Buscar por email (búsqueda parcial)',
    example: 'admin'
  })
  @IsString({ message: 'Email debe ser texto' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por nombre (búsqueda parcial)',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser texto' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por apellido (búsqueda parcial)',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser texto' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por rol',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado activo',
    example: true
  })
  @IsBoolean({ message: 'Estado activo debe ser booleano' })
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;
}

