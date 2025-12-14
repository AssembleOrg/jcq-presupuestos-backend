import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '~/modules/users/dto'; 
import { StructureCategory } from '@prisma/client';

export class FilterStructureDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string; 

  @IsOptional()
  @IsEnum(StructureCategory)
  category?: StructureCategory;
}