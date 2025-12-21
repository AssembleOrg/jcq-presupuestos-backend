import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString} from 'class-validator';

export class FilterExpenseCategoryDTO{
    @ApiPropertyOptional({
        description:'Nombre de la categoria'
    })
    @IsOptional()
    @IsString()
    expenseCategoryName: string

}