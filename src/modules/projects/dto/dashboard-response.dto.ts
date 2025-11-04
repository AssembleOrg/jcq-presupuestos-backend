import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class DashboardStatsDto {
  @ApiProperty({ description: 'Total de proyectos activos', example: 5 })
  @Expose()
  activeProjects: number;

  @ApiProperty({ description: 'Total de clientes', example: 12 })
  @Expose()
  totalClients: number;

  @ApiProperty({ description: 'Total cobrado de todos los proyectos', example: 150000 })
  @Expose()
  totalCollected: number;

  @ApiProperty({ description: 'Total pendiente de cobro', example: 250000 })
  @Expose()
  totalPending: number;
}

class RecentProjectDto {
  @ApiProperty({ description: 'ID del proyecto' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del cliente' })
  @Expose()
  clientName: string;

  @ApiProperty({ description: 'Dirección del proyecto' })
  @Expose()
  locationAddress: string;

  @ApiProperty({ description: 'Monto total del proyecto' })
  @Expose()
  amount: number;

  @ApiProperty({ description: 'Total pagado hasta ahora' })
  @Expose()
  totalPaid: number;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Estadísticas generales del dashboard', type: DashboardStatsDto })
  @Expose()
  @Type(() => DashboardStatsDto)
  stats: DashboardStatsDto;

  @ApiProperty({ 
    description: 'Últimos 5 proyectos recientes', 
    type: [RecentProjectDto],
    example: [
      {
        id: 'uuid-1',
        clientName: 'Fenix Group',
        locationAddress: 'Av. Corrientes 1234, Buenos Aires',
        amount: 5000000,
        totalPaid: 0
      }
    ]
  })
  @Expose()
  @Type(() => RecentProjectDto)
  recentProjects: RecentProjectDto[];
}

