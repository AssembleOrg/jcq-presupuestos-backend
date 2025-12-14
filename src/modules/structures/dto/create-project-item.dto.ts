import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectItemDto {
  @ApiProperty({ description: 'ID de la estructura a asignar', example: 'uuid-estructura' })
  @IsUUID()
  @IsNotEmpty()
  structureId: string;

  @ApiProperty({ description: 'Cantidad a asignar', example: 5, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}