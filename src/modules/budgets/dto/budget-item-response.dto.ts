import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StructureResponseDto } from '../../structures/dto/structure-response.dto';

export class BudgetItemResponseDto {
    @ApiProperty({ description: 'ID del ítem' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Cantidad' })
    @Expose()
    quantity: number;

    @ApiPropertyOptional({ description: 'Nombre manual (si existe)' })
    @Expose()
    manualName?: string;
    
    @ApiPropertyOptional({ description: 'Datos de la estructura (si existe)' })
    @Expose()
    structure?: StructureResponseDto; 
}