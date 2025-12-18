import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString} from 'class-validator';

export class FilterCollaboratorDTO{
  @ApiPropertyOptional({ 
     description: 'Apellido del colaborador',
     example: 'Martinez'
    })
  @IsOptional()
  @IsString({message: 'El nombre debe ser texto'})
  lastName?: string;

  @ApiPropertyOptional({
        description:'Razon social',
        example:'EmpresaX'
    })
  @IsOptional()
  @IsString({message: 'La razon social debe ser texto'})
  companyName?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por CUIT (búsqueda parcial, case insensitive)',
    example: '2012345'
  })
  @IsString({ message: 'CUIT debe ser texto' })
  @IsOptional()
  cuit?: string;

  @ApiPropertyOptional({ 
    description: 'Buscar por DNI (búsqueda parcial, case insensitive)',
    example: '12345'
  })
  @IsString({ message: 'DNI debe ser texto' })
  @IsOptional()
  dni?: string;

}