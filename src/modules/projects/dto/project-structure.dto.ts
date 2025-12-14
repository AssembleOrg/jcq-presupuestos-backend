import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min} from 'class-validator';

export class ProjectStructureDto {
  @ApiProperty({ description: 'ID de la estructura' })
  @IsUUID()
  @IsNotEmpty()
  structureId: string;

  @ApiProperty({ description: 'Cantidad a asignar' })
  @IsNumber()
  @Min(1)
  quantity: number;
}