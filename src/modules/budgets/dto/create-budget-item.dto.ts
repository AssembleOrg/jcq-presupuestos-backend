import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Min,IsUUID, IsNumber, IsString, IsOptional, ValidateIf,IsNotEmpty } from 'class-validator';

export class CreateBudgetItemDto {
  @ApiProperty({ 
    description: 'Cantidad de la estructura requerida para el  presupuesto',
  })  
  @IsNumber() //TAMBIEN FUNCIONA COMO IsNotEmpty
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  //o es una estructura de la base de datos o es manual el ingreso
  @ApiPropertyOptional({
    description: 'ID de la estructura predefinida a usar en presupuesto',
  })
  @ValidateIf(o => !o.manualName)
  @IsUUID()
  @IsOptional()
  structureId?: string;

  @ApiPropertyOptional({
    description: 'Nombre de ingreso manual de la estructura para el presupuestos',
  })
  @ValidateIf(o => !o.structureId)
  @IsString()
  @IsNotEmpty({ message: 'El nombre manual no puede estar vacío' })
  @IsOptional()
  manualName?: string;
}