import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional,IsArray,ValidateNested,IsNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpenseDTO } from './create-expense.dto';


export class CreateExpenseCategoryDTO{
  @ApiProperty({
    description:'Nombre de la categoria de gasto',
    example:'Combustible'
  })  
  @IsString({message:'El nombre de la categoria debe ser texto'})
  @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
  name: string;
  
  @ApiPropertyOptional({
    description:'Descripcion acerca de la cateogria de gasto',
    example:'Carga de nafta'
  })  
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
      description: 'Lista de gastos que incluyen esta categoria',
      type: [CreateExpenseDTO],
    })
  @IsOptional()  
  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => CreateExpenseDTO) 
  expenses: CreateExpenseDTO[];
}