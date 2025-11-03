import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  @Expose()
  accessToken: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Expose()
  userId: string;

  @ApiProperty({ description: 'Email del usuario' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Rol del usuario' })
  @Expose()
  role: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Expose()
  lastName: string;
}

