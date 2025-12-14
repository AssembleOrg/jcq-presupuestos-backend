import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer'; 
import { 
  IsEnum, 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  Min, 
  IsOptional
} from 'class-validator';
import {StructureCategory} from '@prisma/client';

export class CreateStructureDto {
  
  @ApiProperty({ description: 'Nombre de la estructura', example: 'Andamio Tubular' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Categoría', 
    enum: StructureCategory, 
    example: StructureCategory.CATEGORY_A 
  })
  @IsNotEmpty()
  @IsEnum(StructureCategory)
  category: StructureCategory;

  @ApiProperty({ description: 'Stock inicial', example: 10 })
  @IsNotEmpty({ message: 'El stock es obligatorio' })
  @IsNumber({},{ message: 'El stock debe ser un número' })
  @Min(0)
  stock: number;
  
  @ApiProperty({ description: 'Medida de la estructura', example: '1,85 x 1m' })
  @IsString({message: 'La medida debe ser un texto'})
  @IsOptional()
  measure?: string;

  @ApiProperty({ description: 'Descripción de la estructura', example: 'Estructura metálica para construcción' })
  @IsString()
  @IsOptional()
  description?: string;

  
}