import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'admin@example.com'
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
}

