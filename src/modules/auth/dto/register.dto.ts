import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'nuevo@example.com'
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6
  })
  @IsString({ message: 'Contraseña debe ser texto' })
  @IsNotEmpty({ message: 'Contraseña es requerida' })
  @MinLength(6, { message: 'Contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ 
    description: 'Nombre del usuario',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser texto' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  firstName: string;

  @ApiProperty({ 
    description: 'Apellido del usuario',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser texto' })
  @IsNotEmpty({ message: 'Apellido es requerido' })
  lastName: string;

  @ApiPropertyOptional({ 
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.MANAGER,
    default: UserRole.MANAGER
  })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  @IsOptional()
  role?: UserRole;
}

