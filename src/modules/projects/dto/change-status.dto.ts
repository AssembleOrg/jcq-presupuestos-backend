import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class ChangeProjectStatusDto {
  @ApiProperty({ 
    description: 'Nuevo estado del proyecto',
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE
  })
  @IsEnum(ProjectStatus, { message: 'Estado de proyecto inválido' })
  @IsNotEmpty({ message: 'Estado es requerido' })
  status: ProjectStatus;
}

