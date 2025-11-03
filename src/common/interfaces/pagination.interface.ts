import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Límite de registros por página' })
  limit: number;

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Tiene página siguiente' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Tiene página anterior' })
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMetaDto {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

