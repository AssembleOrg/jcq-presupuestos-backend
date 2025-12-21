import { PartialType } from '@nestjs/swagger';
import { CreateExpenseCategoryDTO } from './create-expense-category.dto';

export class UpdateExpenseCategoryDto extends PartialType(CreateExpenseCategoryDTO) {}