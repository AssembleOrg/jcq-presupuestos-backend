import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Transform } from 'class-transformer';
import { ExpenseCategoryResponseDTO } from './expense-category-response.dto';

export class ExpenseResponseDTO{
    @ApiProperty({ description: 'ID del gasto' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Descripcion del gasto' })
    @Expose()
    description: string;

    @ApiProperty({ description: 'Monto del gasto' })
    @Expose()
    @Transform(({ value }) => parseFloat(value)) // TRANSFORMA EL DECIMAL DE PRISMA A NUMERO JS
    amount: number;

    @ApiProperty({ description:'Fecha en que ocurrió el gasto' })
    @Expose()
    date: Date;

    @ApiProperty({description:'ID de categoria de gasto'})
    @Expose()
    categoryId:string

    @ApiProperty({description:'Categoria de gasto asociada'})
    @Expose()
    category:ExpenseCategoryResponseDTO;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updateddAt: Date;

    @ApiPropertyOptional()
    @Expose()
    deletedAt?: Date;

}