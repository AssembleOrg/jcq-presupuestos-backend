import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Type } from 'class-transformer';

export class ExpenseCategoryResponseDTO{
    @ApiProperty({ description: 'ID de la categoria de gasto' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Nombre de la categoria de gasto' })
    @Expose()
    name: string;

    @ApiPropertyOptional({ description: 'Descripcion la categoria de gasto' })
    @Expose()
    description: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiPropertyOptional()
    @Expose()
    deletedAt?: Date;
}
