import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateWorkRecordDto {
  @ApiProperty({
    description: 'ID del personal',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({
    description: 'Valor por Hora',
    example: 15000.0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0) 
  valuePerHour: number;

  @ApiProperty({
    description: 'Adelanto (Enviar 0 si no hay)',
    example: 20000.0,
    default: 0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  advance: number;

  @ApiProperty({
    description: 'Horas trabajadas el Lunes',
    example: 8,
    default: 0, 
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hoursMonday: number;

  @ApiProperty({
    description: 'Horas trabajadas el Martes',
    example: 8,
    default: 0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hoursTuesday: number;

  @ApiProperty({
    description: 'Horas trabajadas el Miercoles',
    example: 8,
    default: 0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hoursWednesday: number;

  @ApiProperty({
    description: 'Horas trabajadas el Jueves',
    example: 8,
    default: 0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hoursThursday: number;

  @ApiProperty({
    description: 'Horas trabajadas el Viernes',
    example: 8,
    default: 0,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  hoursFriday: number;

  @ApiProperty({
    description: 'Fecha de inicio del registro de trabajo (Lunes de la semana)',
    example: '2023-10-02',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;
}