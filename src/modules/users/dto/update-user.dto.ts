import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    description: 'Email del usuario',
    example: 'usuario@example.com'
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6
  })
  @IsString({ message: 'Contraseña debe ser texto' })
  @MinLength(6, { message: 'Contraseña debe tener al menos 6 caracteres' })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ 
    description: 'Nombre del usuario',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser texto' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ 
    description: 'Apellido del usuario',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser texto' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.MANAGER
  })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Estado activo del usuario',
    example: true
  })
  @IsBoolean({ message: 'Estado activo debe ser booleano' })
  @IsOptional()
  isActive?: boolean;
}

