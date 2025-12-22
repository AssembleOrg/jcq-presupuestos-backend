import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDTO } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDTO) {}